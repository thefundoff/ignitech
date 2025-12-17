import { ArrowRight, Code, Palette, Users, BookOpen, Target, Eye, Heart, Linkedin, Mail, Phone, MapPin, ExternalLink, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import  founder  from "./assets/founder.jpg"

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const scrollToSection = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        html {
          scroll-behavior: smooth;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
      `}</style>

      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-orange-600">IGNITECH</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('#about'); }} className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
              <a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('#services'); }} className="text-gray-700 hover:text-blue-600 transition-colors">Services</a>
              <a href="#projects" onClick={(e) => { e.preventDefault(); scrollToSection('#projects'); }} className="text-gray-700 hover:text-blue-600 transition-colors">Projects</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }} className="text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3 animate-fade-in-up">
              <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('#about'); }} className="block text-gray-700 hover:text-blue-600 transition-colors py-2">About</a>
              <a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('#services'); }} className="block text-gray-700 hover:text-blue-600 transition-colors py-2">Services</a>
              <a href="#projects" onClick={(e) => { e.preventDefault(); scrollToSection('#projects'); }} className="block text-gray-700 hover:text-blue-600 transition-colors py-2">Projects</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('#contact'); }} className="block text-gray-700 hover:text-blue-600 transition-colors py-2">Contact</a>
            </div>
          )}
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 relative overflow-hidden bg-cover bg-center bg-no-repeat min-h-screen flex items-center" style={{backgroundImage: 'url("https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1600")'}}>
        <div className="absolute inset-0 bg-black/45"></div>
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up stagger-1">
              IgniTech Global Services
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-10 leading-relaxed animate-fade-in-up stagger-2">
              Transforming businesses through innovative technology solutions and expert consulting
            </p>
            <a href='#contact'><button className="group bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2 animate-fade-in-up stagger-3">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About Us</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div className="bg-gradient-to-br from-blue-50 to-white p-10 rounded-2xl shadow-lg">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                IgniTech Global Services is a forward-thinking technology company dedicated to empowering businesses
                with cutting-edge digital solutions. We combine technical expertise with strategic thinking to deliver
                transformative results that drive growth and innovation.
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h4>
                    <p className="text-gray-700 leading-relaxed">
                      To deliver world-class technology solutions that empower businesses to thrive in the digital age,
                      while fostering innovation and excellence in everything we do.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h4>
                    <p className="text-gray-700 leading-relaxed">
                      To be the leading technology partner for businesses worldwide, recognized for our innovation,
                      integrity, and commitment to driving meaningful digital transformation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white p-10 rounded-2xl shadow-lg">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">Our Core Values</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h4>
                <p className="text-gray-700 leading-relaxed">
                  We strive for excellence in every project, delivering solutions that exceed expectations.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h4>
                <p className="text-gray-700 leading-relaxed">
                  We embrace new technologies and creative approaches to solve complex challenges.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Integrity</h4>
                <p className="text-gray-700 leading-relaxed">
                  We operate with transparency, honesty, and unwavering commitment to our clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-orange-600 to-blue-800 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Meet Our Founder</h2>
            <div className="w-24 h-1 bg-white mx-auto"></div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-10 rounded-2xl shadow-2xl animate-fade-in-up stagger-2">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-48 h-48 rounded-full overflow-hidden shadow-xl flex-shrink-0 border-4 border-white/30">
                <img src={founder} alt="Founder" className="w-full h-64 object-cover" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-bold mb-3">Visionary Leadership</h3>
                <p className="text-blue-100 text-lg leading-relaxed mb-4">
                  Founded by a passionate technologist with a vision to bridge the gap between business challenges
                  and technological solutions. Our founder, Shalom-David brings years of industry experience and a deep commitment
                  to excellence.
                </p>
                <div className="flex justify-center md:justify-start gap-4">
                  <button className="bg-white/20 hover:bg-white/30 p-3 rounded-lg transition-all">
                    <Linkedin className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">What We Do</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive technology solutions tailored to your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Code className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Software Development</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Web Applications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Mobile Applications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Enterprise Solutions</span>
                </li>
              </ul>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tech Consulting</h3>
              <p className="text-gray-700 leading-relaxed">
                Strategic technology guidance to help you make informed decisions and optimize your digital infrastructure.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Palette className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">UI/UX Design</h3>
              <p className="text-gray-700 leading-relaxed">
                Creating intuitive, beautiful interfaces that delight users and drive engagement through thoughtful design.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 md:col-span-2 lg:col-span-3">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Training & Talent Development</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Empowering teams with cutting-edge skills through comprehensive training programs and talent development initiatives.
                We help organizations build technical capacity and stay ahead in the rapidly evolving tech landscape.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="text-5xl font-bold text-orange-600 mb-4">10+</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Years Experience</h3>
              <p className="text-gray-700">Proven track record of delivering exceptional solutions</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="text-5xl font-bold text-orange-600 mb-4">100%</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Client Satisfaction</h3>
              <p className="text-gray-700">Committed to exceeding expectations on every project</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="text-5xl font-bold text-orange-600 mb-4">24/7</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Support</h3>
              <p className="text-gray-700">Always available to assist you with your needs</p>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Projects</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">Transforming ideas into reality</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Autom8 Consults</h3>
                <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Ongoing
                </span>
              </div>
              <p className="text-gray-600 mb-4">School Management System</p>
              <button className="text-blue-600 font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                View Project <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            <div className="group bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">FOLLOMAX</h3>
              <button className="text-blue-600 font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                View Project <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            <div className="group bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">SIGNALPRO</h3>
              <button className="text-blue-600 font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                View Project <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-6 bg-gradient-to-br from-orange-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h2>
            <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
            <p className="text-xl text-blue-100">Let's start building something amazing together</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl flex items-start gap-4 hover:bg-white/20 transition-all">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Phone</h3>
                  <p className="text-blue-100">+234 (0) 907 657 1636</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl flex items-start gap-4 hover:bg-white/20 transition-all">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Email</h3>
                  <p className="text-blue-100">ignitechglobal@gmail.com</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl flex items-start gap-4 hover:bg-white/20 transition-all">
                <div className="bg-white/20 p-3 rounded-lg">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Location</h3>
                  <p className="text-blue-100">Abuja, Nigeria</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all resize-none"
                    placeholder="Tell us about your project"
                  ></textarea>
                </div>
                <button className="w-full bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-white">IGNITECH</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Transforming businesses through innovative technology solutions.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="#services" className="hover:text-blue-400 transition-colors">Services</a></li>
                <li><a href="#projects" className="hover:text-blue-400 transition-colors">Projects</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><a href="#services" className="hover:text-blue-400 transition-colors">Software Development</a></li>
                <li><a href="#services" className="hover:text-blue-400 transition-colors">Tech Consulting</a></li>
                <li><a href="#services" className="hover:text-blue-400 transition-colors">UI/UX Design</a></li>
                <li><a href="#services" className="hover:text-blue-400 transition-colors">Training</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Connect</h4>
              <div className="flex gap-4">
                <button className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-all">
                  <Linkedin className="w-5 h-5" />
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-all">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2025 IgniTech Global Services. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
