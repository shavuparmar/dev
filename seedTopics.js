import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Topic from './models/Topic.js';

dotenv.config();

const topics = [
  // Programming Languages (1-15)
  {
    name: 'JavaScript Fundamentals',
    description: 'Master the core concepts of JavaScript including variables, functions, objects, and ES6+ features',
    category: 'programming',
    lessons: [
      { title: 'Introduction to JavaScript', content: 'Learn the basics of JavaScript syntax and data types', duration: '30 min', order: 1 },
      { title: 'Variables and Data Types', content: 'Understanding var, let, const and primitive types', duration: '45 min', order: 2 },
      { title: 'Functions and Scope', content: 'Function declarations, expressions, arrow functions, and scope', duration: '60 min', order: 3 },
      { title: 'Objects and Arrays', content: 'Working with objects, arrays, and array methods', duration: '60 min', order: 4 },
      { title: 'ES6+ Features', content: 'Destructuring, spread operator, template literals, and more', duration: '45 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Python for Beginners',
    description: 'Complete Python programming course from basics to advanced concepts',
    category: 'programming',
    lessons: [
      { title: 'Python Setup and Basics', content: 'Installation, syntax, and first program', duration: '30 min', order: 1 },
      { title: 'Data Types and Variables', content: 'Numbers, strings, lists, tuples, dictionaries', duration: '45 min', order: 2 },
      { title: 'Control Flow', content: 'If statements, loops, and conditionals', duration: '45 min', order: 3 },
      { title: 'Functions and Modules', content: 'Defining functions, importing modules', duration: '60 min', order: 4 },
      { title: 'Object-Oriented Programming', content: 'Classes, objects, inheritance, and polymorphism', duration: '90 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Java Programming',
    description: 'Learn Java programming from scratch with hands-on projects',
    category: 'programming',
    lessons: [
      { title: 'Java Basics', content: 'Introduction to Java, JDK setup, and first program', duration: '45 min', order: 1 },
      { title: 'Object-Oriented Concepts', content: 'Classes, objects, inheritance, polymorphism', duration: '90 min', order: 2 },
      { title: 'Collections Framework', content: 'ArrayList, HashMap, Set, and other collections', duration: '60 min', order: 3 },
      { title: 'Exception Handling', content: 'Try-catch blocks, custom exceptions', duration: '45 min', order: 4 },
      { title: 'Multithreading', content: 'Threads, synchronization, and concurrency', duration: '90 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'TypeScript Essentials',
    description: 'TypeScript for JavaScript developers - type safety and modern features',
    category: 'programming',
    lessons: [
      { title: 'TypeScript Introduction', content: 'What is TypeScript and why use it', duration: '30 min', order: 1 },
      { title: 'Basic Types', content: 'Primitive types, arrays, tuples, enums', duration: '45 min', order: 2 },
      { title: 'Interfaces and Types', content: 'Defining custom types and interfaces', duration: '45 min', order: 3 },
      { title: 'Classes and Generics', content: 'Object-oriented TypeScript with generics', duration: '60 min', order: 4 },
      { title: 'Advanced Types', content: 'Union types, intersection types, utility types', duration: '60 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'C++ Programming',
    description: 'Master C++ programming with memory management and advanced features',
    category: 'programming',
    lessons: [
      { title: 'C++ Basics', content: 'Syntax, data types, and basic operations', duration: '45 min', order: 1 },
      { title: 'Pointers and References', content: 'Understanding memory addresses and references', duration: '60 min', order: 2 },
      { title: 'Object-Oriented C++', content: 'Classes, constructors, destructors, inheritance', duration: '90 min', order: 3 },
      { title: 'STL Containers', content: 'Vector, map, set, and other STL containers', duration: '60 min', order: 4 },
      { title: 'Templates and Smart Pointers', content: 'Generic programming and memory management', duration: '75 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Go Programming',
    description: 'Learn Go (Golang) - modern, efficient, and concurrent programming',
    category: 'programming',
    lessons: [
      { title: 'Go Basics', content: 'Installation, syntax, and basic concepts', duration: '30 min', order: 1 },
      { title: 'Data Structures', content: 'Slices, maps, structs, and interfaces', duration: '45 min', order: 2 },
      { title: 'Concurrency', content: 'Goroutines, channels, and select statements', duration: '90 min', order: 3 },
      { title: 'Error Handling', content: 'Error patterns and best practices', duration: '30 min', order: 4 },
      { title: 'Building APIs', content: 'Creating REST APIs with Go', duration: '60 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Rust Programming',
    description: 'Learn Rust - systems programming with memory safety',
    category: 'programming',
    lessons: [
      { title: 'Rust Introduction', content: 'Why Rust, installation, and first program', duration: '30 min', order: 1 },
      { title: 'Ownership and Borrowing', content: 'Understanding Rust\'s memory model', duration: '90 min', order: 2 },
      { title: 'Structs and Enums', content: 'Custom data types in Rust', duration: '45 min', order: 3 },
      { title: 'Error Handling', content: 'Result and Option types', duration: '45 min', order: 4 },
      { title: 'Concurrency', content: 'Threads, channels, and async programming', duration: '75 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'PHP Development',
    description: 'Server-side scripting with PHP for web development',
    category: 'programming',
    lessons: [
      { title: 'PHP Basics', content: 'Syntax, variables, and data types', duration: '30 min', order: 1 },
      { title: 'Forms and User Input', content: 'Handling GET and POST requests', duration: '45 min', order: 2 },
      { title: 'Working with Databases', content: 'MySQL, PDO, and database operations', duration: '90 min', order: 3 },
      { title: 'Object-Oriented PHP', content: 'Classes, inheritance, and namespaces', duration: '60 min', order: 4 },
      { title: 'PHP Frameworks', content: 'Introduction to Laravel and Symfony', duration: '90 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Ruby Programming',
    description: 'Learn Ruby - elegant and productive programming language',
    category: 'programming',
    lessons: [
      { title: 'Ruby Basics', content: 'Syntax, variables, and basic operations', duration: '30 min', order: 1 },
      { title: 'Objects and Classes', content: 'Everything is an object in Ruby', duration: '45 min', order: 2 },
      { title: 'Blocks and Procs', content: 'Understanding closures and blocks', duration: '45 min', order: 3 },
      { title: 'Ruby on Rails', content: 'Introduction to Rails framework', duration: '90 min', order: 4 },
      { title: 'Testing with RSpec', content: 'Writing tests in Ruby', duration: '60 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Swift for iOS',
    description: 'Learn Swift programming for iOS and macOS development',
    category: 'programming',
    lessons: [
      { title: 'Swift Basics', content: 'Syntax, optionals, and basic types', duration: '30 min', order: 1 },
      { title: 'Control Flow', content: 'If statements, loops, and switch', duration: '30 min', order: 2 },
      { title: 'Functions and Closures', content: 'Defining functions and using closures', duration: '45 min', order: 3 },
      { title: 'Classes and Structs', content: 'Object-oriented programming in Swift', duration: '60 min', order: 4 },
      { title: 'iOS Development', content: 'Building your first iOS app', duration: '120 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Kotlin for Android',
    description: 'Modern Android development with Kotlin',
    category: 'programming',
    lessons: [
      { title: 'Kotlin Basics', content: 'Syntax, null safety, and data types', duration: '30 min', order: 1 },
      { title: 'Functions and Lambdas', content: 'Higher-order functions and lambda expressions', duration: '45 min', order: 2 },
      { title: 'Classes and Objects', content: 'OOP in Kotlin with data classes', duration: '45 min', order: 3 },
      { title: 'Coroutines', content: 'Asynchronous programming with coroutines', duration: '90 min', order: 4 },
      { title: 'Android Development', content: 'Building Android apps with Kotlin', duration: '120 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'C# Programming',
    description: 'Learn C# for .NET development',
    category: 'programming',
    lessons: [
      { title: 'C# Basics', content: 'Syntax, types, and basic operations', duration: '30 min', order: 1 },
      { title: 'Object-Oriented Programming', content: 'Classes, inheritance, and polymorphism', duration: '60 min', order: 2 },
      { title: 'LINQ', content: 'Language Integrated Query', duration: '60 min', order: 3 },
      { title: 'Async/Await', content: 'Asynchronous programming in C#', duration: '60 min', order: 4 },
      { title: '.NET Core', content: 'Building applications with .NET Core', duration: '90 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Dart Programming',
    description: 'Learn Dart for Flutter mobile development',
    category: 'programming',
    lessons: [
      { title: 'Dart Basics', content: 'Syntax, variables, and data types', duration: '30 min', order: 1 },
      { title: 'Functions and Classes', content: 'Defining functions and classes in Dart', duration: '45 min', order: 2 },
      { title: 'Asynchronous Programming', content: 'Futures and async/await', duration: '45 min', order: 3 },
      { title: 'Flutter Introduction', content: 'Getting started with Flutter', duration: '60 min', order: 4 },
      { title: 'Building Flutter Apps', content: 'Creating your first Flutter application', duration: '120 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Scala Programming',
    description: 'Functional and object-oriented programming with Scala',
    category: 'programming',
    lessons: [
      { title: 'Scala Basics', content: 'Introduction to Scala syntax', duration: '30 min', order: 1 },
      { title: 'Functions and Collections', content: 'Higher-order functions and immutable collections', duration: '60 min', order: 2 },
      { title: 'Pattern Matching', content: 'Powerful pattern matching in Scala', duration: '45 min', order: 3 },
      { title: 'Type System', content: 'Understanding Scala\'s type system', duration: '60 min', order: 4 },
      { title: 'Akka and Concurrency', content: 'Actor model and concurrent programming', duration: '90 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'R Programming',
    description: 'Data science and statistical computing with R',
    category: 'programming',
    lessons: [
      { title: 'R Basics', content: 'Installation, syntax, and data types', duration: '30 min', order: 1 },
      { title: 'Data Manipulation', content: 'Working with vectors, matrices, and data frames', duration: '60 min', order: 2 },
      { title: 'Data Visualization', content: 'Creating plots with ggplot2', duration: '60 min', order: 3 },
      { title: 'Statistical Analysis', content: 'Performing statistical tests', duration: '90 min', order: 4 },
      { title: 'Machine Learning with R', content: 'Building ML models in R', duration: '120 min', order: 5 },
    ],
    isActive: true,
  },

  // Web Development (16-30)
  {
    name: 'React.js Complete Guide',
    description: 'Master React.js from basics to advanced patterns',
    category: 'web-development',
    lessons: [
      { title: 'React Introduction', content: 'What is React and why use it', duration: '30 min', order: 1 },
      { title: 'Components and JSX', content: 'Creating your first React components', duration: '45 min', order: 2 },
      { title: 'State and Props', content: 'Managing component state and props', duration: '60 min', order: 3 },
      { title: 'Hooks', content: 'useState, useEffect, and custom hooks', duration: '90 min', order: 4 },
      { title: 'Routing with React Router', content: 'Building multi-page applications', duration: '60 min', order: 5 },
      { title: 'State Management', content: 'Context API and Redux', duration: '90 min', order: 6 },
    ],
    isActive: true,
  },
  {
    name: 'Vue.js Mastery',
    description: 'Learn Vue.js framework for building modern web applications',
    category: 'web-development',
    lessons: [
      { title: 'Vue.js Basics', content: 'Introduction to Vue.js and setup', duration: '30 min', order: 1 },
      { title: 'Template Syntax', content: 'Interpolation, directives, and bindings', duration: '45 min', order: 2 },
      { title: 'Components', content: 'Creating and using Vue components', duration: '60 min', order: 3 },
      { title: 'Vuex State Management', content: 'Managing application state', duration: '75 min', order: 4 },
      { title: 'Vue Router', content: 'Client-side routing in Vue', duration: '45 min', order: 5 },
      { title: 'Building Real Apps', content: 'Complete application development', duration: '120 min', order: 6 },
    ],
    isActive: true,
  },
  {
    name: 'Angular Framework',
    description: 'Complete Angular framework course for enterprise applications',
    category: 'web-development',
    lessons: [
      { title: 'Angular Setup', content: 'Installing Angular CLI and creating projects', duration: '30 min', order: 1 },
      { title: 'Components and Modules', content: 'Understanding Angular architecture', duration: '60 min', order: 2 },
      { title: 'Services and Dependency Injection', content: 'Creating and using services', duration: '60 min', order: 3 },
      { title: 'Routing', content: 'Angular Router and navigation', duration: '60 min', order: 4 },
      { title: 'Forms and Validation', content: 'Template-driven and reactive forms', duration: '90 min', order: 5 },
      { title: 'HTTP and Observables', content: 'Making API calls with RxJS', duration: '75 min', order: 6 },
    ],
    isActive: true,
  },
  {
    name: 'Next.js Development',
    description: 'Server-side rendering and static site generation with Next.js',
    category: 'web-development',
    lessons: [
      { title: 'Next.js Introduction', content: 'What is Next.js and why use it', duration: '30 min', order: 1 },
      { title: 'Pages and Routing', content: 'File-based routing system', duration: '45 min', order: 2 },
      { title: 'Data Fetching', content: 'getServerSideProps and getStaticProps', duration: '60 min', order: 3 },
      { title: 'API Routes', content: 'Creating backend APIs in Next.js', duration: '60 min', order: 4 },
      { title: 'Deployment', content: 'Deploying Next.js applications', duration: '45 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js',
    category: 'web-development',
    lessons: [
      { title: 'Node.js Basics', content: 'Introduction to Node.js and npm', duration: '30 min', order: 1 },
      { title: 'Modules and Packages', content: 'CommonJS and ES modules', duration: '45 min', order: 2 },
      { title: 'Express.js Framework', content: 'Building REST APIs with Express', duration: '90 min', order: 3 },
      { title: 'Database Integration', content: 'MongoDB and MySQL with Node.js', duration: '90 min', order: 4 },
      { title: 'Authentication', content: 'JWT and session-based authentication', duration: '75 min', order: 5 },
      { title: 'Testing and Deployment', content: 'Writing tests and deploying apps', duration: '60 min', order: 6 },
    ],
    isActive: true,
  },
  {
    name: 'HTML5 and CSS3',
    description: 'Modern web development with HTML5 and CSS3',
    category: 'web-development',
    lessons: [
      { title: 'HTML5 Basics', content: 'Semantic HTML and new elements', duration: '45 min', order: 1 },
      { title: 'CSS3 Fundamentals', content: 'Selectors, properties, and layout', duration: '60 min', order: 2 },
      { title: 'Flexbox Layout', content: 'Creating flexible layouts with Flexbox', duration: '60 min', order: 3 },
      { title: 'CSS Grid', content: 'Two-dimensional layout system', duration: '60 min', order: 4 },
      { title: 'Responsive Design', content: 'Media queries and mobile-first design', duration: '75 min', order: 5 },
      { title: 'CSS Animations', content: 'Transitions and keyframe animations', duration: '45 min', order: 6 },
    ],
    isActive: true,
  },
  {
    name: 'Tailwind CSS',
    description: 'Utility-first CSS framework for rapid UI development',
    category: 'web-development',
    lessons: [
      { title: 'Tailwind Setup', content: 'Installation and configuration', duration: '30 min', order: 1 },
      { title: 'Utility Classes', content: 'Using Tailwind utility classes', duration: '45 min', order: 2 },
      { title: 'Responsive Design', content: 'Building responsive layouts', duration: '45 min', order: 3 },
      { title: 'Customization', content: 'Customizing Tailwind theme', duration: '45 min', order: 4 },
      { title: 'Building Components', content: 'Creating reusable components', duration: '60 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'SASS/SCSS',
    description: 'CSS preprocessor for better styling',
    category: 'web-development',
    lessons: [
      { title: 'SASS Introduction', content: 'What is SASS and why use it', duration: '30 min', order: 1 },
      { title: 'Variables and Nesting', content: 'Using variables and nested selectors', duration: '45 min', order: 2 },
      { title: 'Mixins and Functions', content: 'Creating reusable code blocks', duration: '45 min', order: 3 },
      { title: 'Partials and Imports', content: 'Organizing SASS files', duration: '30 min', order: 4 },
      { title: 'Advanced Features', content: 'Loops, conditionals, and more', duration: '45 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'GraphQL',
    description: 'Query language for APIs and runtime for executing queries',
    category: 'web-development',
    lessons: [
      { title: 'GraphQL Basics', content: 'Introduction to GraphQL', duration: '30 min', order: 1 },
      { title: 'Queries and Mutations', content: 'Fetching and modifying data', duration: '60 min', order: 2 },
      { title: 'Schema Design', content: 'Designing GraphQL schemas', duration: '60 min', order: 3 },
      { title: 'Apollo Client', content: 'Using Apollo Client in React', duration: '75 min', order: 4 },
      { title: 'Server Implementation', content: 'Building GraphQL servers', duration: '90 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'RESTful APIs',
    description: 'Design and build RESTful APIs',
    category: 'web-development',
    lessons: [
      { title: 'REST Principles', content: 'Understanding REST architecture', duration: '30 min', order: 1 },
      { title: 'HTTP Methods', content: 'GET, POST, PUT, DELETE, PATCH', duration: '45 min', order: 2 },
      { title: 'API Design', content: 'Best practices for API design', duration: '60 min', order: 3 },
      { title: 'Authentication', content: 'API authentication methods', duration: '60 min', order: 4 },
      { title: 'API Documentation', content: 'Documenting APIs with Swagger', duration: '45 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Webpack and Build Tools',
    description: 'Module bundlers and build tools for modern web development',
    category: 'web-development',
    lessons: [
      { title: 'Webpack Basics', content: 'Introduction to Webpack', duration: '30 min', order: 1 },
      { title: 'Loaders and Plugins', content: 'Configuring Webpack', duration: '60 min', order: 2 },
      { title: 'Code Splitting', content: 'Optimizing bundle sizes', duration: '45 min', order: 3 },
      { title: 'Vite', content: 'Fast build tool alternative', duration: '45 min', order: 4 },
      { title: 'Parcel', content: 'Zero-config bundler', duration: '30 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Progressive Web Apps',
    description: 'Build PWAs with offline support and app-like experience',
    category: 'web-development',
    lessons: [
      { title: 'PWA Introduction', content: 'What are PWAs and their benefits', duration: '30 min', order: 1 },
      { title: 'Service Workers', content: 'Offline functionality with service workers', duration: '90 min', order: 2 },
      { title: 'Web App Manifest', content: 'Making apps installable', duration: '30 min', order: 3 },
      { title: 'Push Notifications', content: 'Implementing push notifications', duration: '60 min', order: 4 },
      { title: 'Caching Strategies', content: 'Different caching approaches', duration: '60 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Web Performance',
    description: 'Optimize web applications for speed and performance',
    category: 'web-development',
    lessons: [
      { title: 'Performance Metrics', content: 'Understanding Core Web Vitals', duration: '30 min', order: 1 },
      { title: 'Optimizing Images', content: 'Image formats and lazy loading', duration: '45 min', order: 2 },
      { title: 'Code Splitting', content: 'Reducing bundle sizes', duration: '45 min', order: 3 },
      { title: 'Caching Strategies', content: 'Browser and CDN caching', duration: '45 min', order: 4 },
      { title: 'Monitoring Tools', content: 'Lighthouse, WebPageTest, and more', duration: '30 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Web Security',
    description: 'Security best practices for web applications',
    category: 'web-development',
    lessons: [
      { title: 'OWASP Top 10', content: 'Common security vulnerabilities', duration: '60 min', order: 1 },
      { title: 'Authentication Security', content: 'Secure authentication methods', duration: '60 min', order: 2 },
      { title: 'HTTPS and SSL', content: 'Encrypting data in transit', duration: '45 min', order: 3 },
      { title: 'XSS and CSRF', content: 'Preventing common attacks', duration: '60 min', order: 4 },
      { title: 'Security Headers', content: 'Implementing security headers', duration: '30 min', order: 5 },
    ],
    isActive: true,
  },

  // Mobile Development (31-40)
  {
    name: 'React Native',
    description: 'Build mobile apps with React Native',
    category: 'mobile-development',
    lessons: [
      { title: 'React Native Setup', content: 'Environment setup and first app', duration: '45 min', order: 1 },
      { title: 'Components and Styling', content: 'React Native components and StyleSheet', duration: '60 min', order: 2 },
      { title: 'Navigation', content: 'React Navigation for mobile apps', duration: '75 min', order: 3 },
      { title: 'State Management', content: 'Redux and Context API in React Native', duration: '60 min', order: 4 },
      { title: 'Native Modules', content: 'Accessing native device features', duration: '90 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Flutter Development',
    description: 'Cross-platform mobile development with Flutter',
    category: 'mobile-development',
    lessons: [
      { title: 'Flutter Setup', content: 'Installing Flutter and creating first app', duration: '45 min', order: 1 },
      { title: 'Widgets and Layout', content: 'Understanding Flutter widgets', duration: '60 min', order: 2 },
      { title: 'State Management', content: 'Provider, Bloc, and Riverpod', duration: '90 min', order: 3 },
      { title: 'Navigation', content: 'Navigating between screens', duration: '45 min', order: 4 },
      { title: 'Publishing Apps', content: 'Building and publishing to stores', duration: '90 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'iOS Development with SwiftUI',
    description: 'Modern iOS app development with SwiftUI',
    category: 'mobile-development',
    lessons: [
      { title: 'SwiftUI Basics', content: 'Introduction to SwiftUI', duration: '30 min', order: 1 },
      { title: 'Views and Modifiers', content: 'Building UI with SwiftUI', duration: '60 min', order: 2 },
      { title: 'State Management', content: '@State, @Binding, and @ObservedObject', duration: '60 min', order: 3 },
      { title: 'Navigation', content: 'NavigationView and NavigationLink', duration: '45 min', order: 4 },
      { title: 'Data Persistence', content: 'Core Data and UserDefaults', duration: '75 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Android Development',
    description: 'Native Android development with Kotlin',
    category: 'mobile-development',
    lessons: [
      { title: 'Android Studio Setup', content: 'Installing and configuring Android Studio', duration: '45 min', order: 1 },
      { title: 'Activities and Layouts', content: 'Understanding Android architecture', duration: '60 min', order: 2 },
      { title: 'Fragments', content: 'Building modular UIs with fragments', duration: '60 min', order: 3 },
      { title: 'RecyclerView', content: 'Displaying lists efficiently', duration: '60 min', order: 4 },
      { title: 'Room Database', content: 'Local data persistence', duration: '90 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Ionic Framework',
    description: 'Hybrid mobile app development with Ionic',
    category: 'mobile-development',
    lessons: [
      { title: 'Ionic Setup', content: 'Installing Ionic and creating apps', duration: '30 min', order: 1 },
      { title: 'Components', content: 'Using Ionic UI components', duration: '45 min', order: 2 },
      { title: 'Navigation', content: 'Ionic Router and navigation', duration: '45 min', order: 3 },
      { title: 'Native Plugins', content: 'Accessing device features', duration: '60 min', order: 4 },
      { title: 'Building and Publishing', content: 'Building for iOS and Android', duration: '90 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Xamarin Development',
    description: 'Cross-platform development with Xamarin',
    category: 'mobile-development',
    lessons: [
      { title: 'Xamarin Setup', content: 'Installing Xamarin tools', duration: '45 min', order: 1 },
      { title: 'XAML and UI', content: 'Building user interfaces', duration: '60 min', order: 2 },
      { title: 'MVVM Pattern', content: 'Model-View-ViewModel architecture', duration: '75 min', order: 3 },
      { title: 'Data Binding', content: 'Connecting UI to data', duration: '45 min', order: 4 },
      { title: 'Platform-Specific Code', content: 'Accessing native features', duration: '60 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Mobile App Design',
    description: 'UI/UX design principles for mobile applications',
    category: 'mobile-development',
    lessons: [
      { title: 'Mobile Design Principles', content: 'Understanding mobile UX', duration: '45 min', order: 1 },
      { title: 'Material Design', content: 'Google\'s Material Design guidelines', duration: '60 min', order: 2 },
      { title: 'iOS Human Interface', content: 'Apple\'s design guidelines', duration: '60 min', order: 3 },
      { title: 'Prototyping', content: 'Creating mobile app prototypes', duration: '60 min', order: 4 },
      { title: 'Design Tools', content: 'Figma, Sketch, and Adobe XD', duration: '45 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Mobile Testing',
    description: 'Testing strategies for mobile applications',
    category: 'mobile-development',
    lessons: [
      { title: 'Testing Basics', content: 'Unit testing for mobile apps', duration: '45 min', order: 1 },
      { title: 'UI Testing', content: 'Automated UI testing', duration: '60 min', order: 2 },
      { title: 'Device Testing', content: 'Testing on real devices', duration: '30 min', order: 3 },
      { title: 'Performance Testing', content: 'Measuring app performance', duration: '45 min', order: 4 },
      { title: 'Beta Testing', content: 'TestFlight and Google Play Beta', duration: '30 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Mobile App Monetization',
    description: 'Strategies for monetizing mobile applications',
    category: 'mobile-development',
    lessons: [
      { title: 'Monetization Models', content: 'In-app purchases, ads, subscriptions', duration: '45 min', order: 1 },
      { title: 'In-App Purchases', content: 'Implementing IAP in apps', duration: '60 min', order: 2 },
      { title: 'Ad Integration', content: 'Adding ads to your app', duration: '60 min', order: 3 },
      { title: 'Analytics', content: 'Tracking user behavior', duration: '45 min', order: 4 },
      { title: 'App Store Optimization', content: 'Improving app visibility', duration: '45 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Mobile Security',
    description: 'Security best practices for mobile apps',
    category: 'mobile-development',
    lessons: [
      { title: 'Mobile Security Basics', content: 'Common security threats', duration: '30 min', order: 1 },
      { title: 'Data Encryption', content: 'Encrypting sensitive data', duration: '60 min', order: 2 },
      { title: 'Secure Authentication', content: 'Biometric and secure login', duration: '60 min', order: 3 },
      { title: 'API Security', content: 'Securing API communications', duration: '45 min', order: 4 },
      { title: 'Code Obfuscation', content: 'Protecting app code', duration: '30 min', order: 5 },
    ],
    isActive: true,
  },

  // Data Science & AI/ML (41-50)
  {
    name: 'Machine Learning Fundamentals',
    description: 'Introduction to machine learning concepts and algorithms',
    category: 'data-science',
    lessons: [
      { title: 'ML Introduction', content: 'What is machine learning', duration: '30 min', order: 1 },
      { title: 'Supervised Learning', content: 'Classification and regression', duration: '90 min', order: 2 },
      { title: 'Unsupervised Learning', content: 'Clustering and dimensionality reduction', duration: '90 min', order: 3 },
      { title: 'Model Evaluation', content: 'Metrics and cross-validation', duration: '60 min', order: 4 },
      { title: 'Feature Engineering', content: 'Preparing data for ML', duration: '75 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Deep Learning with TensorFlow',
    description: 'Building neural networks with TensorFlow',
    category: 'ai-ml',
    lessons: [
      { title: 'TensorFlow Basics', content: 'Introduction to TensorFlow', duration: '45 min', order: 1 },
      { title: 'Neural Networks', content: 'Building your first neural network', duration: '90 min', order: 2 },
      { title: 'CNNs', content: 'Convolutional Neural Networks for images', duration: '120 min', order: 3 },
      { title: 'RNNs and LSTMs', content: 'Recurrent networks for sequences', duration: '120 min', order: 4 },
      { title: 'Transfer Learning', content: 'Using pre-trained models', duration: '90 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'PyTorch Deep Learning',
    description: 'Deep learning with PyTorch framework',
    category: 'ai-ml',
    lessons: [
      { title: 'PyTorch Introduction', content: 'Getting started with PyTorch', duration: '45 min', order: 1 },
      { title: 'Tensors and Autograd', content: 'Understanding PyTorch basics', duration: '60 min', order: 2 },
      { title: 'Building Models', content: 'Creating neural network models', duration: '90 min', order: 3 },
      { title: 'Training Models', content: 'Training and optimizing models', duration: '90 min', order: 4 },
      { title: 'Deployment', content: 'Deploying PyTorch models', duration: '75 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Data Analysis with Pandas',
    description: 'Data manipulation and analysis with Python Pandas',
    category: 'data-science',
    lessons: [
      { title: 'Pandas Basics', content: 'Introduction to DataFrames', duration: '45 min', order: 1 },
      { title: 'Data Cleaning', content: 'Handling missing data and duplicates', duration: '60 min', order: 2 },
      { title: 'Data Transformation', content: 'Grouping, merging, and reshaping', duration: '75 min', order: 3 },
      { title: 'Time Series', content: 'Working with time series data', duration: '60 min', order: 4 },
      { title: 'Advanced Operations', content: 'Complex data operations', duration: '60 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Data Visualization',
    description: 'Creating compelling visualizations with Python and R',
    category: 'data-science',
    lessons: [
      { title: 'Matplotlib Basics', content: 'Creating plots with Matplotlib', duration: '45 min', order: 1 },
      { title: 'Seaborn', content: 'Statistical visualizations', duration: '60 min', order: 2 },
      { title: 'Plotly', content: 'Interactive visualizations', duration: '60 min', order: 3 },
      { title: 'Tableau', content: 'Business intelligence visualization', duration: '90 min', order: 4 },
      { title: 'Best Practices', content: 'Design principles for data viz', duration: '45 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Natural Language Processing',
    description: 'Processing and understanding human language with NLP',
    category: 'ai-ml',
    lessons: [
      { title: 'NLP Basics', content: 'Introduction to NLP', duration: '30 min', order: 1 },
      { title: 'Text Preprocessing', content: 'Tokenization, stemming, lemmatization', duration: '60 min', order: 2 },
      { title: 'Word Embeddings', content: 'Word2Vec, GloVe, and transformers', duration: '90 min', order: 3 },
      { title: 'Sentiment Analysis', content: 'Analyzing text sentiment', duration: '75 min', order: 4 },
      { title: 'Language Models', content: 'BERT, GPT, and modern NLP', duration: '120 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Computer Vision',
    description: 'Image processing and computer vision techniques',
    category: 'ai-ml',
    lessons: [
      { title: 'CV Introduction', content: 'What is computer vision', duration: '30 min', order: 1 },
      { title: 'Image Processing', content: 'OpenCV basics and image manipulation', duration: '90 min', order: 2 },
      { title: 'Object Detection', content: 'Detecting objects in images', duration: '120 min', order: 3 },
      { title: 'Image Classification', content: 'Classifying images with CNNs', duration: '120 min', order: 4 },
      { title: 'Face Recognition', content: 'Face detection and recognition', duration: '90 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Big Data with Spark',
    description: 'Processing large datasets with Apache Spark',
    category: 'data-science',
    lessons: [
      { title: 'Spark Introduction', content: 'What is Apache Spark', duration: '30 min', order: 1 },
      { title: 'RDDs', content: 'Resilient Distributed Datasets', duration: '60 min', order: 2 },
      { title: 'DataFrames', content: 'Working with Spark DataFrames', duration: '75 min', order: 3 },
      { title: 'Spark SQL', content: 'SQL queries on big data', duration: '60 min', order: 4 },
      { title: 'Streaming', content: 'Real-time data processing', duration: '90 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'SQL for Data Science',
    description: 'Database queries and data extraction for analysis',
    category: 'data-science',
    lessons: [
      { title: 'SQL Basics', content: 'SELECT, WHERE, JOIN operations', duration: '60 min', order: 1 },
      { title: 'Advanced Queries', content: 'Subqueries, CTEs, and window functions', duration: '90 min', order: 2 },
      { title: 'Data Aggregation', content: 'GROUP BY, HAVING, and aggregations', duration: '60 min', order: 3 },
      { title: 'Performance Optimization', content: 'Indexing and query optimization', duration: '60 min', order: 4 },
      { title: 'NoSQL Databases', content: 'MongoDB, Cassandra, and more', duration: '90 min', order: 5 },
    ],
    isActive: true,
  },
  {
    name: 'Data Engineering',
    description: 'Building data pipelines and ETL processes',
    category: 'data-science',
    lessons: [
      { title: 'ETL Basics', content: 'Extract, Transform, Load processes', duration: '45 min', order: 1 },
      { title: 'Data Pipelines', content: 'Building data pipelines', duration: '90 min', order: 2 },
      { title: 'Airflow', content: 'Workflow orchestration with Airflow', duration: '120 min', order: 3 },
      { title: 'Data Warehousing', content: 'Designing data warehouses', duration: '90 min', order: 4 },
      { title: 'Real-time Processing', content: 'Streaming data processing', duration: '90 min', order: 5 },
    ],
    isActive: true,
  },
];

async function seedTopics() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing topics
    await Topic.deleteMany({});
    console.log('Cleared existing topics');

    // Insert topics
    const inserted = await Topic.insertMany(topics);
    console.log(`✅ Seeded ${inserted.length} topics successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding topics:', error);
    process.exit(1);
  }
}

seedTopics();

