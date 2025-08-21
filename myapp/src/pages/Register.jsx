import React from 'react';

const Register = () => {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Create Your Account</h1>
        <p className="mt-4 text-gray-600">
          Sign up to get started with FishNet!
        </p>
      </div>
      <form className="mx-auto mb-0 mt-8 max-w-md space-y-4" action="#">
        <div>
          <label className="sr-only" htmlFor="email">Email</label>
          <div className="relative">
            <input
              placeholder="Enter your email"
              className="w-full rounded-lg border-gray-300 p-4 pe-12 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              id="email"
              type="email"
            />
          </div>
        </div>
        <div>
          <label className="sr-only" htmlFor="password">Password</label>
          <div className="relative">
            <input
              placeholder="Create a password"
              className="w-full rounded-lg border-gray-300 p-4 pe-12 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              id="password"
              type="password"
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Already have an account?
            <a href="/login" className="underline">Sign in</a>
          </p>
          <button
            className="inline-block rounded-lg bg-purple-600 px-5 py-3 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
