import React from "react";

const Contact = () => {
  return (
    <section className="bg-gray-100 py-12">
      <div className="px-4 mx-auto max-w-screen-md">
        <h2 className="text-3xl font-bold text-center mb-4">Contact Us</h2>
        <p className="mb-8 lg:mb-16 font-light text-center text-gray-600">
          Got a technical issue? Want to send feedback about a beta feature? Let us know.
        </p>
        <form action="#" className="space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <div>
            <label htmlFor="email" className="form__label block text-lg font-medium text-gray-700 mb-2">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="example@gmail.com"
              className="form__input mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryColor focus:border-primaryColor sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="subject" className="form__label block text-lg font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              placeholder="Let us know how we can help"
              className="form__input mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryColor focus:border-primaryColor sm:text-sm"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="form__label block text-lg font-medium text-gray-700 mb-2">
              Your Message
            </label>
            <textarea
              id="message"
              placeholder="Leave a comment"
              rows="4"
              className="form__input mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primaryColor focus:border-primaryColor sm:text-sm"
              required
            ></textarea>
          </div>
          <div>
            <button type="submit" className="w-full py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-primaryColor shadow-sm hover:bg-primaryColor-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primaryColor">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
