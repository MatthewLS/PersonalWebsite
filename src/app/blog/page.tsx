import Link from 'next/link';

const Blog = () => {
  const images = [
    { src: '/TellyVia.jpg', href: '/post1', alt: 'Post 1' },
    { src: '/TahoePier.jpg', href: '/post2', alt: 'Post 2' },
    { src: '/GGBridge.jpg', href: '/post3', alt: 'Post 3' },
    { src: '/kitchenCounter.jpg', href: '/post4', alt: 'Post 4' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-wrap justify-center items-center p-10">
      {images.map((image, index) => (
        <Link
		  key={index}
		  href={image.href}
		  className="relative group transform hover:scale-110 hover:translate-y-[-10px] transition-all duration-300"
		>
		  <img
		    src={image.src}
		    alt={image.alt}
		    className="transition-all duration-500 group-hover w-64 h-64 object-cover rounded-xl shadow-lg group-hover:shadow-2xl"
		  />
		</Link>
      ))}
    </div>
  );
};

export default Blog;
