import React from 'react'
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { type Site } from '@/db'

interface DashboardSiteSelectorProps {
  sites: Site[]
  selectedSiteId: string
  onSiteChange: (siteId: string) => void
}

export default function DashboardSiteSelector({ 
  sites, 
  selectedSiteId, 
  onSiteChange 
}: DashboardSiteSelectorProps) {
  return (
    <Select value={selectedSiteId} onValueChange={onSiteChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a site" />
      </SelectTrigger>
      
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Websites</SelectLabel>
          
          {sites.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.title}
            </SelectItem>
          ))}
          
          {sites.length === 0 && (
            <SelectItem value="none" disabled>
              No sites found
            </SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}