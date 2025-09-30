import { auth } from "@/auth";
import { EmptyState } from "@/components/dashboard/emptystate";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import React from "react";

const Dashboard = async () => {
  const session = await auth();
  if (!session?.user) {
    return redirect("/");
  }
  const data = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
    select: {
      userName: true,
      eventtype: {
        select: {
          id: true,
          active: true,
          title: true,
          url: true,
          duration: true,
        },
      },
    },
  });
  if (!data) {
    return notFound();
  }
  return (
    <>
      {data.eventtype.length === 0 ? (
        <EmptyState
          title="You have no Event Types"
          description="You can create your first event type by clicking the button below"
          buttonText="Add event type"
          href="/dashboard/new"
        />
      ) : null}
    </>
  );
};

export default Dashboard;
