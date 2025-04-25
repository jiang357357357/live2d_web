// JavaScript 动态处理消息和API调用
const chatContainer = document.getElementById('chatContainer');
const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('userInput');

// 存储 conversation_id
let conversationId = ''; // 初始为空，后续从响应中更新

// 用户发送消息
function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return; // 空消息不处理

    // 添加用户消息
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'chat-message user';
    userMessageDiv.innerHTML = `
        <div class="bubble">${message}</div>
    `;
    messagesDiv.appendChild(userMessageDiv);

    // 清空输入框
    userInput.value = '';

    // 滚动到最新消息
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    // 调用新API获取角色回复
    fetchChatResponse(message);
}

// 监听回车键发送
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// 调用新API
async function fetchChatResponse(userMessage) {
    try {
        // 替换为你的API密钥
        const apiKey = 'app-wLj2PrXjUUQqh3ZXrsWWos39'; // 请替换为你的API密钥
        const response = await fetch('http://server.xcyyds.top:50006/v1/chat-messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                inputs: {},
                query: userMessage,
                response_mode: 'blocking', // 非流式响应
                conversation_id: conversationId, // 使用存储的 conversation_id
                user: 'abc-123',
                files: [], // 如果不需要文件，留空
            }),
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        // 解析JSON响应
        const data = await response.json();

        // 输出完整响应到终端
        console.log('API Complete Response:', data);

        // 提取并更新 conversation_id
        if (data.conversation_id) {
            conversationId = data.conversation_id;
            console.log('Updated conversation_id:', conversationId); // 记录更新
        }

        // 提取回复内容（假设字段为 answer）
        const message = data.answer || '嘻嘻~好像没收到回复呢~（眨眼）';

        // 添加角色回复
        const roleMessageDiv = document.createElement('div');
        roleMessageDiv.className = 'chat-message role';
        roleMessageDiv.innerHTML = `
            <div class="bubble">${message}</div>
        `;
        messagesDiv.appendChild(roleMessageDiv);

        // 滚动到最新消息
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    } catch (error) {
        // 输出错误详情到终端
        console.error('Error fetching API response:', {
            query: userMessage,
            error: error.message,
            conversation_id: conversationId, // 包含当前 conversation_id
            timestamp: new Date().toISOString(),
        });

        // 显示错误气泡
        const roleMessageDiv = document.createElement('div');
        roleMessageDiv.className = 'chat-message role';
        roleMessageDiv.innerHTML = `
            <div class="bubble">嘻嘻~好像出了点小问题呢~（轻笑）</div>
        `;
        messagesDiv.appendChild(roleMessageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
}