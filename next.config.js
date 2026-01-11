/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.ibb.co']
  }
}

module.exports = nextConfig
```

**.gitignore**
```
node_modules
.next
.DS_Store
*.log
.env*.local
