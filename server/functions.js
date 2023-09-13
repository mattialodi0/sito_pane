function welcomeMessage(user) {
    const date = new Date();
    const id = Math.floor(Math.random() * 1000000000);
    
    return {
        id,
        title: "Benvenuto, "+user,
        content: "...",
        dest: user,
        date,
        read: false
    }
}

function createStats() {
    return {
        orders: 0,
        completedOrders: 0,
    }
}

module.exports = {
    welcomeMessage: welcomeMessage,
    createStats: createStats,
 }