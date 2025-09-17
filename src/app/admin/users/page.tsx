'use client'

import { useState } from 'react'
import UserList from '@/components/admin/UserList'
import UserForm from '@/components/admin/UserForm'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface User {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
  updatedAt: string
  _count: {
    posts: number
  }
}

export default function AdminUsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleCreateUser = () => {
    setSelectedUser(null)
    setIsFormOpen(true)
    setError('')
    setSuccess('')
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsFormOpen(true)
    setError('')
    setSuccess('')
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedUser(null)
    setError('')
    setSuccess('')
  }

  const handleSaveUser = async (userData: any) => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const isEditing = !!selectedUser
      const url = isEditing 
        ? `/api/admin/users/${selectedUser.id}`
        : '/api/admin/users'
      
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(
          isEditing 
            ? 'Cập nhật người dùng thành công!' 
            : 'Tạo người dùng mới thành công!'
        )
        setIsFormOpen(false)
        setSelectedUser(null)
        
        // Refresh the user list by forcing a re-render
        window.location.reload()
      } else {
        throw new Error(data.error || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.error('Error saving user:', error)
      setError(error instanceof Error ? error.message : 'Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <UserList 
          onCreateUser={handleCreateUser}
          onEditUser={handleEditUser}
        />

        <UserForm
          user={selectedUser}
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSave={handleSaveUser}
          loading={loading}
        />
      </div>
    </div>
  )
}