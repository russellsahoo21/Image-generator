import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      {/* 🌌 Hero Section */}
      <section>
        <div className="bg-black text-white py-20">
          <div className="container mx-auto flex flex-col md:flex-row items-center my-12 md:my-24">
            
            {/* LEFT TEXT SECTION */}
            <div className="flex flex-col w-full lg:w-1/3 justify-center items-start p-8 lg:ml-16 xl:ml-24">
              <h1 className="text-3xl md:text-5xl p-2 text-yellow-300 tracking-loose">
                TechFest
              </h1>
              <h2 className="text-3xl md:text-5xl leading-relaxed md:leading-snug mb-2">
                Space : The Timeless Infinity
              </h2>
              <p className="text-sm md:text-base text-gray-50 mb-4">
                Explore your favourite events and register now to showcase your talent and win exciting prizes.
              </p>
              <Link
                to="/post"
                className="bg-transparent hover:bg-yellow-300 text-yellow-300 hover:text-black rounded shadow hover:shadow-lg py-2 px-4 border border-yellow-300 hover:border-transparent transition-all"
              >
                Generate Now
              </Link>
            </div>

            {/* RIGHT IMAGE SECTION */}
            <div className="p-8 mt-12 mb-6 md:mb-0 md:mt-0 ml-0 md:ml-12 lg:w-2/3 justify-center">
              <div className="h-48 flex flex-wrap content-center justify-center">
                
                {/* LEFT CAPSULE — hidden on small screens */}
                <div className="hidden lg:block">
                  <img
                    className="inline-block mt-28"
                    src="https://user-images.githubusercontent.com/54521023/116969935-c13d5b00-acd4-11eb-82b1-5ad2ff10fb76.png"
                    alt="Planet graphic left"
                  />
                </div>

                {/* CENTER CAPSULE — always visible */}
                <div>
                  <img
                    className="inline-block mt-24 md:mt-0 p-8 md:p-0"
                    src="https://user-images.githubusercontent.com/54521023/116969931-bedb0100-acd4-11eb-99a9-ff5e0ee9f31f.png"
                    alt="Planet graphic center"
                  />
                </div>

                {/* RIGHT CAPSULE — hidden on small screens */}
                <div className="hidden lg:block">
                  <img
                    className="inline-block mt-28"
                    src="https://user-images.githubusercontent.com/54521023/116969939-c1d5f180-acd4-11eb-8ad4-9ab9143bdb50.png"
                    alt="Planet graphic right"
                  />
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

        <hr className="my-px w-full  bg-white border-0" />



      {/* 🖼️ Image Gallery Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-10">
            Flux Generations
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* COLUMN 1 */}
            <div className="grid gap-4">
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg"
                alt="Event 1"
              />
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg"
                alt="Event 2"
              />
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg"
                alt="Event 3"
              />
            </div>

            {/* COLUMN 2 */}
            <div className="grid gap-4">
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg"
                alt="Event 4"
              />
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-4.jpg"
                alt="Event 5"
              />
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-5.jpg"
                alt="Event 6"
              />
            </div>

            {/* COLUMN 3 */}
            <div className="grid gap-4">
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-6.jpg"
                alt="Event 7"
              />
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-7.jpg"
                alt="Event 8"
              />
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-8.jpg"
                alt="Event 9"
              />
            </div>

            {/* COLUMN 4 */}
            <div className="grid gap-4">
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-9.jpg"
                alt="Event 10"
              />
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-10.jpg"
                alt="Event 11"
              />
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-11.jpg"
                alt="Event 12"
              />
            </div>
          </div>
        </div>
      </section>

      <hr className="my-px w-full  bg-white border-0" />


      <footer className="py-4 bg-black">
      <div className="text-center text-sm text-gray-300">
        © 2025 Flux | AI Image generator All Rights Reserved.
      </div>
    </footer>
    </>
  );
}

export default Home;
