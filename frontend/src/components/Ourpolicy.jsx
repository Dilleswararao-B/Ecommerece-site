import React from 'react';
// You can use your own icons or images from assets
import qualityIcon from '../assets/quality_icon.png';
import exchangeIcon from '../assets/exchange_icon.png';
import supportImg from '../assets/support_img.png';
import razorpayLogo from '../assets/razorpay_logo.png';

const policies = [
  {
    icon: qualityIcon,
    title: 'Quality Product',
    desc: 'We provide only the best quality products for our customers.',
  },
  {
    icon: exchangeIcon,
    title: 'Easy Exchange',
    desc: 'Hassle-free returns and exchanges within 30 days.',
  },
  {
    icon: supportImg,
    title: '24/7 Support',
    desc: 'Our support team is available around the clock.',
  },
  {
    icon: razorpayLogo,
    title: 'Secure Payment',
    desc: 'All payments are processed securely.',
  },
];

const OurPolicy = () => (
  <div className="my-16">
    <div className="text-center py-8 text-3xl font-bold">
      Our Policy
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
      {policies.map((policy, idx) => (
        <div key={idx} className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
          <img src={policy.icon} alt={policy.title} className="w-16 h-16 mb-4" />
          <h3 className="text-lg font-semibold mb-2">{policy.title}</h3>
          <p className="text-gray-600 text-center text-sm">{policy.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export default OurPolicy;
