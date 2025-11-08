import Link from 'next/link'

export default function Header({ title, description, actions }) {
  return (
    <header className="bg-gradient-to-r from-primary-500 to-purple-600 text-white py-8 mb-8 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            {description && (
              <p className="text-primary-100 text-lg">{description}</p>
            )}
          </div>
          {actions && (
            <div className="flex gap-3 flex-wrap">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
