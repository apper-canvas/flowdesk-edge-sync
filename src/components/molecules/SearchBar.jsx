import React, { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'

const SearchBar = ({ onSearch, placeholder = "Search...", className = '' }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        icon={<ApperIcon name="Search" className="w-4 h-4 text-gray-400" />}
        className="w-full"
      />
    </form>
  )
}

export default SearchBar