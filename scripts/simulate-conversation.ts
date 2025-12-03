const API_URL = process.env.API_URL || "http://localhost:3000";

interface Message {
  from: string;
  to: string;
  content: string;
}


async function sendMessage(message: Message, showLog = true) {
  try {
    const response = await fetch(`${API_URL}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    const data = await response.json();
    if (showLog) {
      console.log(`✓ [${message.from} → ${message.to}]: ${message.content}`);
    }
    return data;
  } catch (error) {
    console.error(`✗ [${message.from} → ${message.to}]: Failed`);
    throw error;
  }
}


const messageTemplates = [
  "Hey {to}! How are you doing?",
  "Hi {to}! I'm doing great, thanks for asking!",
  "Just working on this cool NoSQL project with MongoDB.",
  "That sounds interesting! What are you building?",
  "It's a messaging API. Pretty fun actually!",
  "Nice! Are you using Docker for deployment?",
  "Yes! I have everything running in Docker containers.",
  "That's awesome! Docker makes everything so much easier.",
  "Definitely! Want to grab coffee later?",
  "Sure! I'd love to. How about 3 PM?",
  "Perfect! See you then!",
  "See you!",
  "What's up?",
  "Not much, just coding. You?",
  "Same here! Working on a new feature.",
  "Cool! Let me know if you need help.",
  "Thanks! I appreciate it.",
  "No problem!",
  "Have you tried the new API yet?",
  "Yeah, it's really fast!",
];

// Generator function to create messages on-demand (stream-like behavior)
async function* generateMessages(numUsers: number, messagesPerUser: number) {
  for (let i = 0; i < numUsers; i++) {
    const userId = `User${i}`;
    const recipientId = `User${(i + 1) % numUsers}`; // Send to next user (circular)

    for (let j = 0; j < messagesPerUser; j++) {
      const templateIndex = Math.floor(Math.random() * messageTemplates.length);
      const template = messageTemplates[templateIndex] || "Hello!";
      const content = template.replace('{to}', recipientId);

      yield {
        from: userId,
        to: recipientId,
        content,
      };
    }
  }
}

async function simulateMassiveConversation(numUsers: number) {
  const NUM_USERS = numUsers;
  const MESSAGES_PER_USER = 2;
  const TOTAL_MESSAGES = NUM_USERS * MESSAGES_PER_USER;

  console.log("=".repeat(70));
  console.log(`🚀 MASSIVE CONVERSATION SIMULATION`);
  console.log("=".repeat(70));
  console.log(`📊 Configuration:`);
  console.log(`   • Users: ${NUM_USERS.toLocaleString()}`);
  console.log(`   • Messages per user: ${MESSAGES_PER_USER}`);
  console.log(`   • Total messages: ${TOTAL_MESSAGES.toLocaleString()}`);
  console.log(`   • API URL: ${API_URL}`);
  console.log(`   • Strategy: Stream-based generation (zero memory overhead)`);
  console.log("=".repeat(70));
  console.log();

  const startTime = Date.now();

  try {
    console.log(`🚀 Streaming messages and sending simultaneously...`);
    console.log(`   ⚡ Generating on-demand with zero memory buffering!`);
    console.log(`   📡 All ${TOTAL_MESSAGES.toLocaleString()} messages will be sent as fast as possible...`);
    console.log();

    const sendStartTime = Date.now();

    // Track progress during sending
    let completedCount = 0;
    let successCount = 0;
    let errorCount = 0;

    const progressInterval = setInterval(() => {
      const elapsed = ((Date.now() - sendStartTime) / 1000).toFixed(1);
      const rate = completedCount > 0 ? (completedCount / parseFloat(elapsed)).toFixed(0) : '0';
      const progress = ((completedCount / TOTAL_MESSAGES) * 100).toFixed(1);
      console.log(`   ⏳ Progress: ${progress}% | Completed: ${completedCount.toLocaleString()}/${TOTAL_MESSAGES.toLocaleString()} | Rate: ${rate} msg/s | Elapsed: ${elapsed}s`);
    }, 5000); // Log every 5 seconds

    // Create an array of promises by consuming the generator
    const messagePromises: Promise<any>[] = [];

    for await (const message of generateMessages(NUM_USERS, MESSAGES_PER_USER)) {
      // Send each message immediately as it's generated
      const promise = sendMessage(message, false)
        .then((result) => {
          completedCount++;
          successCount++;
          return result;
        })
        .catch((error) => {
          completedCount++;
          errorCount++;
          throw error;
        });

      messagePromises.push(promise);
    }

    // Wait for all messages to complete
    await Promise.allSettled(messagePromises);

    clearInterval(progressInterval);

    const sendDuration = ((Date.now() - sendStartTime) / 1000).toFixed(2);
    console.log(`   ✓ All requests completed in ${sendDuration}s`);
    console.log();

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log();
    console.log("=".repeat(70));
    console.log("✅ SIMULATION COMPLETED!");
    console.log("=".repeat(70));
    console.log(`📊 Results Summary:`);
    console.log();
    console.log(`   Request Statistics:`);
    console.log(`   • Total requests sent: ${(successCount + errorCount).toLocaleString()}`);
    console.log(`   • Successful: ${successCount.toLocaleString()} (${((successCount / (successCount + errorCount)) * 100).toFixed(2)}%)`);
    console.log(`   • Failed: ${errorCount.toLocaleString()} (${((errorCount / (successCount + errorCount)) * 100).toFixed(2)}%)`);
    console.log();
    console.log(`   Performance Metrics:`);
    console.log(`   • Total duration: ${duration.toFixed(2)}s`);
    console.log(`   • Average throughput: ${(successCount / duration).toFixed(2)} messages/second`);
    console.log(`   • Peak concurrent requests: ${(NUM_USERS * MESSAGES_PER_USER).toLocaleString()}`);
    console.log("=".repeat(70));

  } catch (error) {
    console.log();
    console.log("=".repeat(70));
    console.error("❌ SIMULATION FAILED!");
    console.log("=".repeat(70));
    console.error(error);
    console.log("=".repeat(70));
    process.exit(1);
  }
}

// Get number of users from command line argument or use default
const numUsers = process.argv[2] ? parseInt(process.argv[2]) : 100000;

if (isNaN(numUsers) || numUsers <= 0) {
  console.error("❌ Error: Please provide a valid positive number of users");
  console.log("\nUsage: bun scripts/simulate-conversation.ts <number_of_users>");
  console.log("Example: bun scripts/simulate-conversation.ts 50000");
  process.exit(1);
}

// Run the simulation
simulateMassiveConversation(numUsers);
