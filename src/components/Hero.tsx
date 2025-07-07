import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = React.memo(() => {
  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ 
          backgroundImage: `url('https://github.com/Otvet161/dsadas/blob/main/8fJce9oFJcJfk11jTrxkOAVsE5_kjqRrhwB-2ve5ldRsERPjoMoT18jx6apoSKmxesoPjac18n95tKP1MHyF0Z3G%20(1).jpg?raw=true')`,
          opacity: 1
        }}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="text-center text-white">
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">
            ФК ГУДАУТА
          </h1>
          <p className="mb-8 text-lg md:text-xl">
            Футбольный клуб с богатой историей и традициями
          </p>
          <Link 
            to="/team"
            className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-primary/90"
          >
            О команде
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
});

Hero.displayName = 'Hero';

export default Hero;
