'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Bell, CheckSquare, Heart, Highlighter, Clock, Search, Plus, Image as ImageIcon, Link, Star, Trash, User, LogOut } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation'
import { getNotes, createNote, updateNote, deleteNote, logout } from '@/src/lib/api'

type Note = {
  _id: string
  title: string
  content: string
  date: string
  color: string
  isFavorite: boolean
  isTask: boolean
  isCompleted?: boolean
  reminder?: string
  highlights?: string[]
  images?: string[]
  urls?: string[]
}

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([])
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [savedSearches, setSavedSearches] = useState<string[]>([])
  const [activities, setActivities] = useState<string[]>([])
  const [userName, setUserName] = useState("User") // Add state for user name
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchNotes()
    // Fetch user name from API or localStorage
    const fetchUserName = async () => {
      try {
        // Replace this with an actual API call if you have one
        const storedUserName = localStorage.getItem('userName')
        if (storedUserName) {
          setUserName(storedUserName)
        } else {
          // If no stored name, you might want to fetch it from an API
          // const response = await fetch('/api/user')
          // const data = await response.json()
          // setUserName(data.name)
        }
      } catch (error) {
        console.error('Failed to fetch user name:', error)
      }
    }
    fetchUserName()
  }, [])


  const fetchNotes = async () => {
    try {
      const fetchedNotes = await getNotes()
      setNotes(fetchedNotes)
    } catch (error) {
      console.error('Failed to fetch notes:', error)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const addNote = async () => {
    const colors = ['bg-red-400', 'bg-green-300', 'bg-blue-300', 'bg-yellow-200', 'bg-purple-300','bg-gray-500']
    const newNote: Omit<Note, '_id'> = {
      title: "New Note",
      content: "...",
      date: new Date().toLocaleString(),
      color: colors[Math.floor(Math.random() * colors.length)],
      isFavorite: false,
      isTask: false,
      images: [],
      urls: [],
      highlights: []
    }
    try {
      const createdNote = await createNote(newNote)
      setNotes([...notes, createdNote])
      setActiveNote(createdNote)
    } catch (error) {
      console.error('Failed to create note:', error)
    }
  }

  const handleUpdateNote = async (updatedNote: Note) => {
    try {
      const updated = await updateNote(updatedNote._id, updatedNote)
      setNotes(notes.map(note => note._id === updated._id ? updated : note))
      setActiveNote(updated)
    } catch (error) {
      console.error('Failed to update note:', error)
    }
  }

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id)
      setNotes(notes.filter(note => note._id !== id))
      if (activeNote?._id === id) {
        setActiveNote(null)
      }
    } catch (error) {
      console.error('Failed to delete note:', error)
    }
  }

  const addImage = (id: string, imageUrl: string) => {
    const noteToUpdate = notes.find(note => note._id === id)
    if (noteToUpdate) {
      const updatedNote = { ...noteToUpdate, images: [...(noteToUpdate.images || []), imageUrl] }
      handleUpdateNote(updatedNote)
    }
  }

  const addUrl = (id: string, url: string) => {
    const noteToUpdate = notes.find(note => note._id === id)
    if (noteToUpdate) {
      const updatedNote = { ...noteToUpdate, urls: [...(noteToUpdate.urls || []), url] }
      handleUpdateNote(updatedNote)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && activeNote) {
      const reader = new FileReader()
      reader.onloadend = () => {
        addImage(activeNote._id, reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlAdd = () => {
    if (activeNote) {
      const url = prompt("Enter URL:")
      if (url) {
        addUrl(activeNote._id, url)
      }
    }
  }

  const addHighlight = (id: string, highlight: string) => {
    const noteToUpdate = notes.find(note => note._id === id)
    if (noteToUpdate) {
      const updatedNote = { ...noteToUpdate, highlights: [...(noteToUpdate.highlights || []), highlight] }
      handleUpdateNote(updatedNote)
    }
  }

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    switch (activeTab) {
      case "reminders":
        return matchesSearch && note.reminder
      case "tasks":
        return matchesSearch && note.isTask
      case "favorites":
        return matchesSearch && note.isFavorite
      case "highlights":
        return matchesSearch && note.highlights && note.highlights.length > 0
      default:
        return matchesSearch
    }
  })

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900">
      <header className="bg-yellow-400 p-4 flex justify-between items-center shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">Note-Canvas</h1>
        <div className="flex items-center space-x-4">
          <span className="font-medium text-gray-700">{userName}</span>
          <Button variant="outline" size="icon" className="rounded-full text-white">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleLogout} className="rounded-full text-white">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-white p-4 border-r border-gray-200 overflow-auto">
          <div className="mb-4">
            <Input 
              type="text" 
              placeholder="Search notes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-gray-300 focus:border-amber-500 focus:ring-amber-500"
            />
          </div>
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="reminders">Reminders</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="highlights">Highlights</TabsTrigger>
              </TabsList>
              {["all", "reminders", "tasks", "favorites", "highlights"].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-gray-700",
                      activeTab === tab && "bg-amber-100 text-amber-900 font-medium"
                    )}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === "all" && <FileText className="mr-2 h-4 w-4" />}
                    {tab === "reminders" && <Bell className="mr-2 h-4 w-4" />}
                    {tab === "tasks" && <CheckSquare className="mr-2 h-4 w-4" />}
                    {tab === "favorites" && <Heart className="mr-2 h-4 w-4" />}
                    {tab === "highlights" && <Highlighter className="mr-2 h-4 w-4" />}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Button>
                </TabsContent>
              ))}
            </Tabs>
          </ScrollArea>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {activeTab === "all" ? "All Notes" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <Button onClick={addNote} className="bg-black hover:bg-amber-500 text-white">
              <Plus className="mr-2 h-4 w-4 " /> New Note
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map(note => (
              <div 
                key={note._id}
                onClick={() => setActiveNote(note)}
                className={cn(
                  "p-4 rounded-lg shadow-md cursor-pointer transition-all duration-200 hover:shadow-lg",
                  note.color,
                  activeNote?._id === note._id ? "ring-2 ring-amber-500" : ""
                )}
              >
                <h3 className="font-bold text-lg mb-2">{note.title}</h3>
                <p className="text-sm text-gray-700 mb-2">{new Date(note.date).toLocaleString()}</p>
                <p className="text-gray-800 font-semibold">{note.content.substring(0, 100)}...</p>
                <div className="mt-4 flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleUpdateNote({ ...note, isFavorite: !note.isFavorite }); }}>
                    <Heart className={cn("h-4 w-4", note.isFavorite ? "text-red-500 fill-red-500" : "text-gray-400")} />
                  </Button>
                  {note.isTask && (
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleUpdateNote({ ...note, isCompleted: !note.isCompleted }); }}>
                      <CheckSquare className={cn("h-4 w-4", note.isCompleted ? "text-green-500" : "text-gray-400")} />
                    </Button>
                  )}
                  {note.reminder && (
                    <Bell className="h-4 w-4 text-yellow-500" />
                  )}
                  {note.highlights && note.highlights.length > 0 && (
                    <Highlighter className="h-4 w-4 text-blue-500" />
                  )}
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteNote(note._id); }}>
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {activeNote && (
          <div className="w-1/3 bg-white p-6 border-l border-gray-200 overflow-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Edit Note</h2>
            <Input 
              type="text" 
              value={activeNote.title} 
              onChange={(e) => handleUpdateNote({ ...activeNote, title: e.target.value })}
              className="mb-4 w-full bg-white border-gray-300 focus:border-amber-500 focus:ring-amber-500 font-bold"
            />
            <Textarea 
              value={activeNote.content} 
              onChange={(e) => handleUpdateNote({ ...activeNote, content: e.target.value })}
              className="mb-4 w-full h-64 bg-white border-gray-300 focus:border-amber-500 focus:ring-amber-500 font-semibold"
            />
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={() => handleUpdateNote({ ...activeNote, isTask: !activeNote.isTask })} className="bg-white text-gray-700 border-gray-300 hover:bg-gray-100">
                  <CheckSquare className={cn("mr-2 h-4 w-4", activeNote.isTask ? "text-green-500" : "")} />
                  {activeNote.isTask ? "Remove Task" : "Add Task"}
                </Button>
                <Button variant="outline" onClick={() => handleUpdateNote({ ...activeNote, isFavorite: !activeNote.isFavorite })} className="bg-white text-gray-700 border-gray-300 hover:bg-gray-100">
                  <Star className={cn("mr-2 h-4 w-4", activeNote.isFavorite ? "text-yellow-400 fill-yellow-400" : "")} />
                  {activeNote.isFavorite ? "Remove Favorite" : "Add Favorite"}
                </Button>
              </div>
              <Input
                type="datetime-local"
                value={activeNote.reminder ? new Date(activeNote.reminder).toISOString().slice(0, 16) : ''}
                onChange={(e) => handleUpdateNote({ ...activeNote, reminder: e.target.value })}
                className="w-full bg-white border-gray-300 focus:border-amber-500 focus:ring-amber-500"
              />
              <div className="flex  items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Add highlight..."
                  className="flex-grow bg-white border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addHighlight(activeNote._id, e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  ref={fileInputRef}
                />
                <Button variant="outline" className="bg-white text-black border-gray-300 hover:bg-gray-100" size="icon" onClick={() => fileInputRef.current?.click()}>
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Button variant="outline" className="bg-white text-black border-gray-300 hover:bg-gray-100" size="icon" onClick={handleUrlAdd}>
                  <Link className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {activeNote.highlights && activeNote.highlights.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2 text-gray-700">Highlights</h4>
                {activeNote.highlights.map((highlight, index) => (
                  <div key={index} className="bg-yellow-200 p-2 mb-2 rounded text-gray-800">
                    {highlight}
                  </div>
                ))}
              </div>
            )}
            {activeNote.images && activeNote.images.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2 text-gray-700 font-serif">Images</h4>
                <div className="grid grid-cols-2 gap-2">
                  {activeNote.images.map((image, index) => (
                    <img key={index} src={image} alt={`Note image ${index + 1}`} className="w-full h-auto rounded shadow-sm" />
                  ))}
                </div>
              </div>
            )}
            {activeNote.urls && activeNote.urls.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2 text-gray-700 font-serif">Bookmarked URLs</h4>
                {activeNote.urls.map((url, index) => (
                  <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="block text-amber-600 hover:underline mb-1">
                    {url}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}