import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_CONNECTION_STR,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Connected to redis!"));

await redisClient.connect();

export default redisClient;
