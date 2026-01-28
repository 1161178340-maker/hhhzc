const { loadKnowledgeBase, chatWithBot, resetConversation } = require('../src/utils/bot');

async function testBot() {
  console.log('=== 开始测试数字分身机器人 ===\n');

  try {
    loadKnowledgeBase();

    console.log('\n--- 测试 1: 简单问候 ---');
    const result1 = await chatWithBot('你好');
    console.log('用户: 你好');
    console.log('机器人:', result1.reply);
    console.log('使用技术:', result1.technique);
    console.log('决策理由:', result1.reason);

    console.log('\n--- 测试 2: 表达情绪 ---');
    const result2 = await chatWithBot('最近好累啊');
    console.log('用户: 最近好累啊');
    console.log('机器人:', result2.reply);
    console.log('使用技术:', result2.technique);
    console.log('决策理由:', result2.reason);

    console.log('\n--- 测试 3: 寻求建议 ---');
    const result3 = await chatWithBot('你觉得我该怎么办');
    console.log('用户: 你觉得我该怎么办');
    console.log('机器人:', result3.reply);
    console.log('使用技术:', result3.technique);
    console.log('决策理由:', result3.reason);

    console.log('\n--- 测试 4: 重置对话 ---');
    const resetResult = resetConversation();
    console.log('重置结果:', resetResult.success ? '成功' : '失败');

    console.log('\n--- 测试 5: 重置后的对话 ---');
    const result4 = await chatWithBot('我们又见面了');
    console.log('用户: 我们又见面了');
    console.log('机器人:', result4.reply);
    console.log('使用技术:', result4.technique);
    console.log('决策理由:', result4.reason);

    console.log('\n=== 所有测试完成 ===');

  } catch (error) {
    console.error('测试失败:', error);
    process.exit(1);
  }
}

testBot();
