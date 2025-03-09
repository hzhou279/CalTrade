"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";

export default function Home() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          {isLoading ? (
            "Loading authentication status..."
          ) : isAuthenticated ? (
            <>
              Welcome, {user?.name || user?.email || user?.phone || "User"}!{" "}
              <button
                onClick={logout}
                className="text-blue-500 underline cursor-pointer"
              >
                Sign out
              </button>
            </>
          ) : (
            "Please sign in to access the application"
          )}
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      {isAuthenticated && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
          <div className="space-y-2">
            {user?.name && (
              <p>
                <span className="font-semibold">Name:</span> {user.name}
              </p>
            )}
            {user?.email && (
              <p>
                <span className="font-semibold">Email:</span> {user.email}
              </p>
            )}
            {user?.phone && (
              <p>
                <span className="font-semibold">Phone:</span> {user.phone}
              </p>
            )}
            {user?.id && (
              <p>
                <span className="font-semibold">User ID:</span> {user.id}
              </p>
            )}
          </div>
        </div>
      )}

      <div className={styles.grid}>
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Docs <span>-&gt;</span>
          </h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Learn <span>-&gt;</span>
          </h2>
          <p>Learn about Next.js in an interactive course with&nbsp;quizzes!</p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Templates <span>-&gt;</span>
          </h2>
          <p>Explore starter templates for Next.js.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            Deploy <span>-&gt;</span>
          </h2>
          <p>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  );
}
