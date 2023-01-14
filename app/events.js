// handler ctrl+c
process.on("SIGINT", (data) => {
    process.exit();
});
process.on ("exit", (data)=> {
    console.log("\nServer is stoped");
})