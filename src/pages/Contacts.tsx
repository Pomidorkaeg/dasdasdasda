import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Contacts = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Сообщение отправлено",
        description: "Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.",
      });
      
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16 page-transition">
        {/* Header - Changed to green background as requested */}
        <div className="relative bg-fc-green text-white py-16">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-fc-green/90 to-fc-darkGreen/80"
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'overlay'
            }}
          ></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-4xl font-bold mb-4">Контакты</h1>
              <p className="max-w-2xl text-white/80 text-lg">
                Свяжитесь с нами, если у вас есть вопросы или предложения
              </p>
            </div>
          </div>
        </div>
        
        {/* Contact Information */}
        <section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Наши контакты</h2>
              
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="bg-fc-green/10 p-2 md:p-3 rounded-full text-fc-green flex-shrink-0">
                    <MapPin size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-base md:text-lg mb-1">Адрес</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      Новосибирск, ул. Спортивная, 20
                    </p>
                    <p className="text-gray-600 text-sm md:text-base">
                      Стадион "Спартак"
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="bg-fc-green/10 p-2 md:p-3 rounded-full text-fc-green flex-shrink-0">
                    <Phone size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-base md:text-lg mb-1">Телефон</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      +7 (383) 123-45-67
                    </p>
                    <p className="text-gray-600 text-sm md:text-base">
                      +7 (383) 123-45-68
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="bg-fc-green/10 p-2 md:p-3 rounded-full text-fc-green flex-shrink-0">
                    <Mail size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-base md:text-lg mb-1">Email</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      info@fcsibirsk.ru
                    </p>
                    <p className="text-gray-600 text-sm md:text-base">
                      press@fcsibirsk.ru
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="bg-fc-green/10 p-2 md:p-3 rounded-full text-fc-green flex-shrink-0">
                    <Clock size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-base md:text-lg mb-1">Время работы</h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      Понедельник - Пятница: 9:00 - 18:00
                    </p>
                    <p className="text-gray-600 text-sm md:text-base">
                      Суббота: 10:00 - 16:00
                    </p>
                    <p className="text-gray-600 text-sm md:text-base">
                      Воскресенье: выходной
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Map or Contact Form */}
            <div className="mt-6 md:mt-0">
              <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold mb-4">Напишите нам</h3>
                <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Ваше имя
                  </label>
                  <input
                      type="text"
                    id="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fc-green focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                  </label>
                  <input
                      type="email"
                    id="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fc-green focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Сообщение
                  </label>
                  <textarea
                    id="message"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fc-green focus:border-transparent"
                  ></textarea>
                </div>
                <button
                  type="submit"
                    className="w-full bg-fc-green text-white py-2 px-4 rounded-md hover:bg-fc-darkGreen transition-colors duration-200"
                  >
                    Отправить
                </button>
              </form>
              </div>
            </div>
          </div>
        </section>
        
        {/* Map */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Как нас найти</h2>
            
            <div className="aspect-video rounded-xl overflow-hidden shadow-md">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2288.4876717214894!2d82.9183!3d54.9833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTTCsDU5JzE4LjkiTiA4MsKwNTQnNTkuNiJF!5e0!3m2!1sen!2sru!4v1620836291220!5m2!1sen!2sru" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                title="Google Maps"
              ></iframe>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contacts;
