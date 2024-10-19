"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Pen, FolderOpen, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <header className="p-4 flex justify-between items-center  bg-yellow-400 sticky top-0 z-10">
        <h1 className="text-2xl font-bold">Note-Canvas</h1>
        <nav className="space-x-2">
          <Button asChild variant="outline" className="bg-white hover:bg-yellow-100 text-black border-black">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild variant="outline" className="bg-white hover:bg-yellow-100 text-black border-black">
            <Link href="#about">About</Link>
          </Button>
          <Button asChild variant="outline" className="bg-white hover:bg-yellow-100 text-black border-black">
            <Link href="/login">Login</Link>
          </Button>
        </nav>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        <section className="flex flex-col md:flex-row items-center justify-between mb-16">
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Note taking <br /> made easy
            </h2>
            <p className="text-xl text-gray-700">
              Organize your thoughts, capture ideas, and boost your productivity with our intuitive note-taking app.
            </p>
            <div className="space-x-4">
              <Button asChild className="bg-yellow-400 text-black hover:bg-yellow-500">
                <Link href="/signup">
                  Get started, it's free
                </Link>
              </Button>
              <Button asChild variant="outline" className="text-black bg-white border-black hover:bg-yellow-100">
                <Link href="/login">
                  Sign in
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <div className="relative w-80 h-80 mx-auto">
              <img
                src="https://static-00.iconduck.com/assets.00/note-taking-illustration-2048x1707-hqbvyl4v.png?height=400&width=400"
                alt="Note-taking illustration"
                width={320}
                height={320}
                className="rounded-full bg-yellow-100"
              />
              <div className="absolute top-0 right-0 bg-white rounded-full p-2 shadow-lg">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1869/1869397.png?height=80&width=80"
                  alt="Pencil icon"
                  width={60}
                  height={60}
                />
              </div>
              <div className="absolute bottom-0 left-0 bg-white rounded-full p-2 shadow-lg">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1869/1869397.png?height=80&width=80"
                  alt="Calendar icon"
                  width={60}
                  height={60}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="border-t-2 border-yellow-400 my-16"></div>

        <motion.section 
          id="about"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">About Note-Canvas</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Capture Ideas", 
                description: "Easily jot down ideas as they come to mind with our user-friendly note-taking interface.", 
                icon: <Pen className="h-8 w-8 text-yellow-500" />
              },
              { 
                title: "Organize Notes", 
                description: "Tag your notes and organize them into notebooks, so you'll never lose track of your ideas.", 
                icon: <FolderOpen className="h-8 w-8 text-yellow-500" />
              },
              { 
                title: "Collaborate in Real-time", 
                description: "Share your notes with others and collaborate on projects in real-time.", 
                icon: <Users className="h-8 w-8 text-yellow-500" />
              },
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="bg-blue-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <section className="bg-blue-200 p-8 rounded-lg shadow-md mb-4">
          <h2 className="text-2xl font-bold mb-4">Why Choose Note-Canvas?</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-800">
            <li>Clean, intuitive interface for effortless note-taking</li>
            <li>Powerful organization tools to keep your thoughts structured</li>
            <li>Seamless sync across all your devices</li>
            <li>Robust search functionality to find notes quickly</li>
            <li>Customizable themes to suit your personal style</li>
          </ul>
        </section>
      </main>

      <footer className=" bg-yellow-500 p-4 text-center text-sm text-gray-800">
        <div className="container mx-auto">
          <p>© 2024 Note-Canvas. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}