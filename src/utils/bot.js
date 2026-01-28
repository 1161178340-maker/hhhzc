const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config();

function getClient() {
  const API_KEY = process.env.DASHSCOPE_API_KEY;
  if (!API_KEY) {
    throw new Error('请在 .env 文件中设置 DASHSCOPE_API_KEY');
  }
  return new OpenAI({
    apiKey: API_KEY,
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1'
  });
}

let technique_theory = {};
let vector_store = null;
let conversation_history = [];
const chat_log_file = path.join(process.cwd(), 'chat_history.json');
const vector_db_file = path.join(process.cwd(), 'vector_db.json');

class VectorStore {
  constructor() {
    this.documents = [];
    this.load();
  }

  load() {
    if (fs.existsSync(vector_db_file)) {
      const data = fs.readFileSync(vector_db_file, 'utf-8');
      this.documents = JSON.parse(data);
      console.log(`✅ 向量数据库已加载，共 ${this.documents.length} 个文档`);
    }
  }

  save() {
    fs.writeFileSync(vector_db_file, JSON.stringify(this.documents, null, 2), 'utf-8');
  }

  add(documents) {
    this.documents.push(...documents);
    this.save();
    console.log(`✅ 已添加 ${documents.length} 个文档到向量数据库`);
  }

  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\u4e00-\u9fa5a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  computeTF(text) {
    const tokens = this.tokenize(text);
    const tf = {};
    tokens.forEach(token => {
      tf[token] = (tf[token] || 0) + 1;
    });
    return tf;
  }

  computeIDF() {
    const idf = {};
    const totalDocs = this.documents.length;
    
    this.documents.forEach(doc => {
      const tokens = new Set(this.tokenize(doc.context));
      tokens.forEach(token => {
        idf[token] = (idf[token] || 0) + 1;
      });
    });

    Object.keys(idf).forEach(token => {
      idf[token] = Math.log(totalDocs / (1 + idf[token]));
    });

    return idf;
  }

  computeTFIDF(text, idf) {
    const tf = this.computeTF(text);
    const tfidf = {};
    Object.keys(tf).forEach(token => {
      tfidf[token] = tf[token] * (idf[token] || 0);
    });
    return tfidf;
  }

  cosineSimilarity(vec1, vec2) {
    const keys = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    keys.forEach(key => {
      const v1 = vec1[key] || 0;
      const v2 = vec2[key] || 0;
      dotProduct += v1 * v2;
      norm1 += v1 * v1;
      norm2 += v2 * v2;
    });

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2) + 1e-10);
  }

  query(queryText, technique = null, nResults = 2) {
    if (this.documents.length === 0) {
      return { ids: [[]], metadatas: [[]] };
    }

    const idf = this.computeIDF();
    const queryTFIDF = this.computeTFIDF(queryText, idf);

    let filteredDocs = this.documents;
    if (technique) {
      filteredDocs = this.documents.filter(doc => doc.technique === technique);
    }

    const scores = filteredDocs.map(doc => ({
      doc,
      score: this.cosineSimilarity(queryTFIDF, this.computeTFIDF(doc.context, idf))
    }));

    scores.sort((a, b) => b.score - a.score);
    const topResults = scores.slice(0, nResults);

    const metadatas = topResults.map(result => ({
      reply: result.doc.reply,
      technique: result.doc.technique,
      thinking: result.doc.thinking,
      summary: result.doc.summary
    }));

    const ids = topResults.map((_, index) => index.toString());

    return {
      ids: [ids],
      metadatas: [metadatas]
    };
  }

  count() {
    return this.documents.length;
  }
}

function loadKnowledgeBase() {
  console.log('🔄 正在加载知识库...');
  const rawData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'all_chapters.json'), 'utf-8')
  );

  technique_theory = {};
  const dialogueSamples = [];

  for (const [chapterKey, cases] of Object.entries(rawData)) {
    const techniqueMatch = chapterKey.match(/[:：]\s*(.+)/);
    const technique = techniqueMatch ? techniqueMatch[1].trim() : '未知';

    for (const item of cases) {
      if (item.theory) {
        technique_theory[technique] = item.theory;
      }

      if (item.dialogue) {
        const dialogue = item.dialogue;
        const history = [];
        
        for (const turn of dialogue) {
          if (!turn.reply) continue;
          
          const role = turn.role;
          const content = turn.reply.content;
          
          if (role === 'B') {
            history.push(`B: ${content}`);
          } else if (role === 'A') {
            let thinking, summary;
            if (turn.thinking && turn.summary) {
              thinking = turn.thinking;
              summary = turn.summary;
            } else if (turn.background_and_technique) {
              const thinkingMatch = turn.background_and_technique.match(/思路是：(.+)/);
              const summaryMatch = turn.background_and_technique.match(/思路概括：(.+)/);
              if (thinkingMatch && summaryMatch) {
                thinking = thinkingMatch[1].trim();
                summary = summaryMatch[1].trim();
              }
            }
            
            if (thinking && summary) {
              const context = history.length > 0 ? history.slice(-5).join(' | ') : '[开场]';
              dialogueSamples.push({
                context,
                reply: content,
                technique,
                thinking,
                summary
              });
            }
            history.push(`A: ${content}`);
          }
        }
      }
    }
  }

  vector_store = new VectorStore();

  if (vector_store.count() === 0) {
    console.log(`🔍 发现新数据，正在索引 ${dialogueSamples.length} 个案例...`);
    vector_store.add(dialogueSamples);
  }

  console.log(`✅ 系统就绪！加载了 ${Object.keys(technique_theory).length} 种技术，${dialogueSamples.length} 个案例。`);
  return true;
}

async function decideTechnique(currentContext) {
  let theoryText = '';
  for (const [tech, th] of Object.entries(technique_theory)) {
    const usage = th.usage ? th.usage.join('、') : '';
    const precautions = th.precautions ? th.precautions.join('；') : '';
    theoryText += `【${tech}】\n- 用途：${usage}\n- 注意事项：${precautions}\n\n`;
  }

  const prompt = `
你是一个社交策略专家。当前对话上下文：
「${currentContext}」

以下是可用沟通技术及其规则：
${theoryText}

请选出**最应使用的单一 technique**，并说明理由。
输出严格为 JSON 格式：{"selected_technique": "xxx", "reason": "xxx"}
`;

  try {
    const resp = await getClient().chat.completions.create({
      model: 'qwen-plus',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 200
    });

    return JSON.parse(resp.choices[0].message.content);
  } catch (error) {
    console.error('决策失败，使用默认值:', error);
    return { selected_technique: '询问', reason: '默认回退' };
  }
}

async function generateReply(currentContext, decision) {
  const tech = decision.selected_technique;
  const th = technique_theory[tech] || {};

  const usage = th.usage ? th.usage.join('、') : '';
  const precautions = th.precautions ? th.precautions.join('；') : '';

  const results = vector_store.query(currentContext, tech, 2);

  let casesText = '';
  for (let i = 0; i < Math.min(2, results.ids[0].length); i++) {
    const rep = results.metadatas[0][i].reply;
    const think = results.metadatas[0][i].thinking;
    const summ = results.metadatas[0][i].summary;
    casesText += `回复：${rep}\n思考：${think}\n策略：${summ}\n\n`;
  }

  const prompt = `
你正在使用「${tech}」技术。
- 用途：${usage}
- 注意事项：${precautions}
不能连续多次使用同一个${tech}
参考案例：
${casesText}

当前上下文：「${currentContext}」
对话多用短句，每句不超过12字，末尾没有标点符号。生成一条自然、有效的回复。不能连续多次使用同一个${tech}。只输出回复内容。
`;

  try {
    const resp = await getClient().chat.completions.create({
      model: 'qwen-plus',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 100
    });

    return resp.choices[0].message.content.trim();
  } catch (error) {
    console.error('生成回复失败:', error);
    return '我理解了';
  }
}

function saveChatLog(userMsg, botReply, decision) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    user_input: userMsg,
    bot_reply: botReply,
    technique_used: decision.selected_technique,
    decision_reason: decision.reason
  };

  let logs = [];
  if (fs.existsSync(chat_log_file)) {
    logs = JSON.parse(fs.readFileSync(chat_log_file, 'utf-8'));
  }

  logs.push(logEntry);
  fs.writeFileSync(chat_log_file, JSON.stringify(logs, null, 2), 'utf-8');
}

async function chatWithBot(userMessage) {
  conversation_history.push(`B: ${userMessage}`);
  const currentContext = conversation_history.slice(-5).join(' | ');

  const decision = await decideTechnique(currentContext);
  const reply = await generateReply(currentContext, decision);

  saveChatLog(userMessage, reply, decision);

  conversation_history.push(`A: ${reply}`);

  return {
    reply,
    technique: decision.selected_technique,
    reason: decision.reason
  };
}

function resetConversation() {
  conversation_history = [];
  return { success: true };
}

module.exports = {
  loadKnowledgeBase,
  chatWithBot,
  resetConversation,
  technique_theory
};
