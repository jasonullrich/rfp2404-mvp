import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full bg-white/5 p-8 text-white flex flex-col gap-2 justify-center items-center">
      <p>
        Daria model by <a href="https://sketchfab.com/medusa21">medusa21</a>,
        licensed under{' '}
        <a href="http://creativecommons.org/licenses/by/4.0/">
          Creative Commons Attribution
        </a>
        .
      </p>
      <p>
        Kart model modified from a model by{' '}
        <a href="https://sketchfab.com/ppesoj">ppesoj</a>, licensed under{' '}
        <a href="http://creativecommons.org/licenses/by/4.0/">
          Creative Commons Attribution
        </a>
        .
      </p>
      <p>
        Title screen by{' '}
        <a href="https://www.instagram.com/giraffalope/">giraffalope</a>, a good
        friend.
      </p>
    </footer>
  )
}

export default Footer
