import { AuthRequest } from "./auth";
import { Response } from "express";
import { prisma } from "./prismaClient";

type HealthRecordBody = {
  health: number;
  motivation: number;
};

export async function resisterHealthRecordHandler(req: AuthRequest, res: Response) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "未ログインです" });
  }

  const { health, motivation } = req.body as HealthRecordBody;

  try {
    const newRecord = await prisma.healthCheck.create({
      data: {
        employeeId: user.id,
        health: health,
        motivation: motivation,
      },
      select: {
        recordedAt: true,
      }
    });

    const date = new Date(newRecord.recordedAt);
    const hours = String(date.getHours()).padStart(2,"0");
    const minutes = String(date.getMinutes()).padStart(2,"0");

    return res.status(201).json({
      message: `体調記録を完了しました(${hours}:${minutes})`,
      recordedAt: newRecord.recordedAt,
    })
  } catch(error) {
    console.error("Health record registration failed:", error);
    return res.status(500).json({ message: "体調記録の処理中にエラーが発生しました。"});
  }
}
