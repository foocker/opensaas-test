/**
 * 手动初始化统计数据
 * 用于首次启动管理员 Dashboard 时生成初始数据
 */
import { prisma } from "wasp/server";
import { SubscriptionStatus } from "../payment/plans";

export async function initializeDailyStats() {
  const nowUTC = new Date(Date.now());
  nowUTC.setUTCHours(0, 0, 0, 0);

  // 检查今天是否已有统计数据
  const existingStats = await prisma.dailyStats.findUnique({
    where: {
      date: nowUTC,
    },
  });

  if (existingStats) {
    console.log("✅ Daily stats already exist for today");
    return existingStats;
  }

  // 计算用户统计
  const userCount = await prisma.user.count({});
  const paidUserCount = await prisma.user.count({
    where: {
      subscriptionStatus: SubscriptionStatus.Active,
    },
  });

  // 创建初始统计数据
  const dailyStats = await prisma.dailyStats.create({
    data: {
      date: nowUTC,
      totalViews: 0,
      prevDayViewsChangePercent: "0",
      userCount,
      paidUserCount,
      userDelta: 0,
      paidUserDelta: 0,
      totalRevenue: 0,
      totalProfit: 0,
    },
  });

  console.log("✅ Initial daily stats created:", {
    date: dailyStats.date,
    userCount: dailyStats.userCount,
    paidUserCount: dailyStats.paidUserCount,
  });

  return dailyStats;
}
