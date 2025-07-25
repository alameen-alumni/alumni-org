import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Instagram, Facebook, Linkedin, Twitter, Globe } from 'lucide-react';

const coreMembers = [
  { name: 'Kazi Mizanur Rahaman', designation: 'President', passout: '2005', company: 'ABC Corp', socials: { linkedin: 'https://linkedin.com/in/kazi', facebook: 'https://facebook.com/kazi', website: 'https://example.com/kazi' }, image: '' },
  { name: 'Sk Asif Zaman Wareshi (Aaman)', designation: 'Vice President', passout: '2007', company: 'XYZ Ltd', socials: { instagram: 'https://instagram.com/aaman', facebook: 'https://facebook.com/aaman', website: 'https://example.com/aaman' }, image: '' },
  { name: 'Mirza Imran Hoda', designation: 'Secretary', passout: '2008', company: 'DEF Inc', socials: { linkedin: 'https://linkedin.com/in/mirza', twitter: 'https://twitter.com/mirza', website: 'https://example.com/mirza' }, image: '' },
  { name: 'Mahabur Rahaman Tarafdar', designation: 'Joint Secretary', passout: '2009', company: 'GHI Pvt Ltd', socials: { facebook: 'https://facebook.com/mahabur', twitter: 'https://twitter.com/mahabur', website: 'https://example.com/mahabur' }, image: '' },
  { name: 'Nouraj Sorif Mallick', designation: 'Treasurer', passout: '2010', company: 'JKL Bank', socials: { linkedin: 'https://linkedin.com/in/nouraj', facebook: 'https://facebook.com/nouraj', website: 'https://example.com/nouraj' }, image: '' },
  { name: 'Nur Jaman Mandal', designation: 'Executive Member', passout: '2011', company: 'MNO College', socials: { facebook: 'https://facebook.com/nurjaman', instagram: 'https://instagram.com/nurjaman', website: 'https://example.com/nurjaman' }, image: '' },
  { name: 'Golam Mortuja', designation: 'Executive Member', passout: '2012', company: 'PQR University', socials: { twitter: 'https://twitter.com/golam', linkedin: 'https://linkedin.com/in/golam', website: 'https://example.com/golam' }, image: '' },
];

const devTeam = [
  { name: 'Abdul Rahaman', designation: 'Design & Development', passout: '2015', company: 'WebDev Co', socials: { linkedin: 'https://linkedin.com/in/abdul', facebook: 'https://facebook.com/abdul', website: 'https://example.com/abdul' }, image: '' },
  { name: 'Sk Hossain Ali', designation: 'Design & Development', passout: '2016', company: 'AppWorks', socials: { facebook: 'https://facebook.com/hossain', instagram: 'https://instagram.com/hossain', website: 'https://example.com/hossain' }, image: '' },
  { name: 'Md Afzal Mir', designation: 'Design & Development', passout: '2017', company: 'Freelancer', socials: { instagram: 'https://instagram.com/afzal', twitter: 'https://twitter.com/afzal', website: 'https://example.com/afzal' }, image: '' },
];

function SocialLinks({ socials }) {
  return (
    <div className="flex gap-2 mt-1 justify-center">
      {socials.instagram && <a href={socials.instagram} target="_blank" rel="noopener noreferrer"><Instagram className="w-4 h-4 text-pink-500" /></a>}
      {socials.facebook && <a href={socials.facebook} target="_blank" rel="noopener noreferrer"><Facebook className="w-4 h-4 text-blue-600" /></a>}
      {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="w-4 h-4 text-blue-700" /></a>}
      {socials.twitter && <a href={socials.twitter} target="_blank" rel="noopener noreferrer"><Twitter className="w-4 h-4 text-sky-400" /></a>}
      {socials.website && <a href={socials.website} target="_blank" rel="noopener noreferrer"><Globe className="w-4 h-4 text-gray-700" /></a>}
    </div>
  );
}

function MemberCard({ member }) {
  return (
    <Card className="w-full max-w-xs shadow-xl rounded-2xl flex flex-col items-center bg-gradient-to-br from-white via-teal-50 to-indigo-50 border border-teal-100 transition-transform hover:scale-105 hover:shadow-2xl duration-200 relative p-0 overflow-hidden group" style={{ aspectRatio: '16/19' }}>
      {/* Badge in top right, overlaying image */}
      <div className="absolute top-3 right-3 z-10">
        <Badge className="bg-gradient-to-r from-teal-500 to-teal-400 text-white text-xs px-2 py-0.5 shadow-md border-0 drop-shadow-lg">
          {member.designation}
        </Badge>
      </div>
      {/* Image section: top 70% of card */}
      <div className="w-full" style={{ height: '70%' }}>
        <div className="w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-teal-200 to-indigo-100 border-b-2 border-teal-100 group-hover:brightness-105 transition-all duration-200" style={{ height: '100%' }}>
          {member.image ? (
            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-16 h-16 text-indigo-400" />
          )}
        </div>
      </div>
      {/* Card content: bottom 30% */}
      <div className="flex-1 w-full flex flex-col items-center justify-center px-4 py-3 gap-1" style={{ minHeight: '30%' }}>
        {/* Name row */}
        <div className="font-bold text-xl text-teal-900 mb-1 leading-tight mt-1 font-serif tracking-tight group-hover:text-indigo-700 transition-colors duration-200 w-full">
          {member.name}
        </div>
        {/* Company/College and Passout row */}
        <div className="flex flex-row justify-between items-center w-full mb-1">
          <div className="text-xs text-gray-600 font-medium truncate max-w-[60%]">{member.company}</div>
          <div className="text-xs text-gray-500 font-semibold">Passout: {member.passout}</div>
        </div>
        {/* Social links row */}
        <div className="flex gap-3 mt-2 px-7 justify-evenly w-full">
          {Object.entries(member.socials).filter(([_, v]) => v).slice(0, 3).map(([key, v]) => {
            const url = v as string;
            if (!url) return null;
            if (key === 'instagram') return <a key={key} href={url} target="_blank" rel="noopener noreferrer"><Instagram className="w-6 h-6 text-pink-500 hover:scale-125 hover:text-pink-600 transition-transform duration-150" /></a>;
            if (key === 'facebook') return <a key={key} href={url} target="_blank" rel="noopener noreferrer"><Facebook className="w-6 h-6 text-blue-600 hover:scale-125 hover:text-blue-700 transition-transform duration-150" /></a>;
            if (key === 'linkedin') return <a key={key} href={url} target="_blank" rel="noopener noreferrer"><Linkedin className="w-6 h-6 text-blue-700 hover:scale-125 hover:text-blue-900 transition-transform duration-150" /></a>;
            if (key === 'twitter') return <a key={key} href={url} target="_blank" rel="noopener noreferrer"><Twitter className="w-6 h-6 text-sky-400 hover:scale-125 hover:text-sky-600 transition-transform duration-150" /></a>;
            if (key === 'website') return <a key={key} href={url} target="_blank" rel="noopener noreferrer"><Globe className="w-6 h-6 text-gray-700 hover:scale-125 hover:text-indigo-500 transition-transform duration-150" /></a>;
            return null;
          })}
        </div>
      </div>
    </Card>
  );
}

export default function CoreTeam() {
  return (
    <div className="relative bg-gradient-to-br from-white via-indigo-100 to-teal-100 py-4 px-2 flex flex-col items-center overflow-x-hidden">
      {/* Main content area with floating effect */}
      <div className="relative z-10 w-full max-w-full mx-auto flex flex-col gap-16 bg-white/70 backdrop-blur-md border border-teal-100 rounded-3xl shadow-2xl px-2 py-8 md:px-8 md:py-12 animate-fadein">
        <h1 className="text-4xl font-extrabold text-teal-900 mb-4 tracking-tight drop-shadow-lg text-center">Committee Details</h1>
        {/* First Row: 3 members */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mb-6 justify-items-center">
          {coreMembers.slice(0, 3).map((m) => <MemberCard key={m.name} member={m} />)}
        </div>
        {/* Second Row: 4 members */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-6 justify-items-center">
          {coreMembers.slice(3, 7).map((m) => <MemberCard key={m.name} member={m} />)}
        </div>
        {/* Third Row: 3 dev team members */}
        <div className="w-full flex items-center my-6">
          <div className="flex-1 h-px bg-gradient-to-r from-teal-200 via-indigo-200 to-teal-200" />
          <span className="mx-4 text-lg font-semibold text-indigo-700 tracking-wide uppercase" id='developer'>Design & Development Team</span>
          <div className="flex-1 h-px bg-gradient-to-l from-teal-200 via-indigo-200 to-teal-200" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-items-center">
          {devTeam.map((m) => <MemberCard key={m.name} member={m} />)}
        </div>
      </div>
      {/* Fade-in animation keyframes */}
      <style>{`
        @keyframes fadein { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: none; } }
        .animate-fadein { animation: fadein 1.2s cubic-bezier(.33,1,.68,1) both; }
      `}</style>
    </div>
  );
} 