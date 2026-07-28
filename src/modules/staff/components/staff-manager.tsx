import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export function StaffManager() {
  const [staff, setStaff] = useState("");
  const [searchTerm, setSearchTerm] = useState("")
  return (
    <div>
      <div className='flex justify-between mb-4'>
        <h1 className='text-xl md:text-4xl font-bold'>Staff managment</h1>
        <Button>
          Add new staff
        </Button>
      </div>
      <Input
        placeholder='Search...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

    </div>
  )
}
