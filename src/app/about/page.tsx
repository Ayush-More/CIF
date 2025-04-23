"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Navbar from '../components/Navbar';

const FadeInWhenVisible = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
};

const AboutUs = () => {
  const countingStats = {
    projects: 100,
    clients: 50,
    experience: 5
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />
      {/* Hero Section with Parallax Effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[80vh] bg-gradient-to-r from-red-50 via-orange-50 to-red-50"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-full bg-[url('/grid-pattern.png')] opacity-10"></div>
          {/* Animated shapes */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-20 right-20 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-20 left-20 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          />
        </div>

        <div className="relative container mx-auto px-6 h-full flex items-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6">
              Transforming Ideas Into
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500"> Reality</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We're not just another company - we're your partner in innovation and success.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Discover Our Story
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Mission Section with Scrolling Cards */}
      <div className="container mx-auto px-6 py-24">
        <FadeInWhenVisible>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-gray-900">
                Our Mission & Vision
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                We envision a future where technology seamlessly integrates with human expertise,
                creating solutions that not only solve problems but transform the way businesses operate.
              </p>

              {/* Animated Stats */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: 'Projects', value: countingStats.projects, suffix: '+' },
                  { label: 'Clients', value: countingStats.clients, suffix: '+' },
                  { label: 'Years', value: countingStats.experience, suffix: 'Y' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl shadow-lg"
                  >
                    <motion.h3
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      className="font-bold text-3xl text-orange-600"
                    >
                      {stat.value}{stat.suffix}
                    </motion.h3>
                    <p className="text-gray-600">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/about-image.jpg"
                alt="Our Mission"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </motion.div>
          </div>
        </FadeInWhenVisible>
      </div>

      {/* Values Section with Hover Cards */}
      <div className="bg-gray-50 py-24">
        <div className="container mx-auto px-6">
          <FadeInWhenVisible>
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
              Our Core Values
            </h2>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation First",
                description: "Pushing boundaries and embracing cutting-edge technologies",
                icon: "🚀",
                color: "from-orange-400 to-red-400"
              },
              {
                title: "Excellence Always",
                description: "Delivering exceptional quality in every project",
                icon: "⭐",
                color: "from-red-400 to-orange-400"
              },
              {
                title: "Client Success",
                description: "Your success is our primary mission",
                icon: "🎯",
                color: "from-orange-400 to-red-400"
              }
            ].map((value, index) => (
              <FadeInWhenVisible key={index}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className={`bg-gradient-to-r ${value.color} p-6`}>
                    <div className="text-5xl mb-4">{value.icon}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </motion.div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section with Card Hover Effects */}
      <div className="container mx-auto px-6 py-24">
        <FadeInWhenVisible>
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Meet Our Expert Team
          </h2>
        </FadeInWhenVisible>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              name: "John Doe",
              position: "CEO & Founder",
              image: "/team-member-1.jpg",
              social: {
                linkedin: "#",
                twitter: "#"
              }
            },
            {
              name: "Jane Smith",
              position: "CTO",
              image: "/team-member-2.jpg",
              social: {
                linkedin: "#",
                twitter: "#"
              }
            },
            {
              name: "Mike Johnson",
              position: "Lead Developer",
              image: "/team-member-3.jpg",
              social: {
                linkedin: "#",
                twitter: "#"
              }
            }
          ].map((member, index) => (
            <FadeInWhenVisible key={index}>
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="relative h-80">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                    <p className="text-orange-300">{member.position}</p>
                  </div>
                </div>
                <div className="p-6 flex justify-center space-x-4">
                  <motion.a
                    whileHover={{ scale: 1.2 }}
                    href={member.social.linkedin}
                    className="text-gray-600 hover:text-orange-500"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.2 }}
                    href={member.social.twitter}
                    className="text-gray-600 hover:text-orange-500"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </motion.a>
                </div>
              </motion.div>
            </FadeInWhenVisible>
          ))}
        </div>
      </div>

      {/* CTA Section with Animated Background */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500">
          <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-30"></div>
        </div>
        <div className="relative container mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Let's create something extraordinary together
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-orange-500 px-10 py-4 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Start Your Journey
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutUs;