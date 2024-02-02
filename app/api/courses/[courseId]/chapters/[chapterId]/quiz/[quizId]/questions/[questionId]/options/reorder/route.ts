import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { quizId: string; questionId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { list } = await req.json();

    const optionQuestion = await db.quizQuestion.findUnique({
      where: {
        id: params.questionId,
        quizId: params.quizId,
      },
    });

    if (!optionQuestion) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    for (let item of list) {
      await db.quizQuestionOption.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("[REORDER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
