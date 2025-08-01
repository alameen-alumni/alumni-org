import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Globe,
  Mail,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const coreMembers = [
  {
    name: "Kazi Mizanur Rahaman",
    designation: "President",
    passout: "2010",
    company: "LDA in Judicial dept, Govt of WB",
    socials: {
      facebook: "https://www.facebook.com/kazi.mizanur2",
      email: "kazimizanur007@gmail.com",
    },
    image: "/KaziMizanur.jpg",
  },
  {
    name: "Sk Asif Zaman Wareshi (Aaman)",
    designation: "Vice President",
    passout: "2011",
    company: "MBBS , MD in Radiodiagnosis",
    socials: {
      instagram: "https://www.instagram.com/asif_wareshi",
      facebook: "https://www.facebook.com/a.zaman.90813",
      email: "asif.wareshi@gmail.com",
    },
    image: "/SkAsifZaman.jpg",
  },
  {
    name: "Mirza Imran Hoda",
    designation: "General Secretary",
    passout: "2011",
    company: "Key Account Manager at Swiggy",
    socials: {
      facebook: "https://facebook.com/share/1Avp9Hyhxz",
      linkedin: "https://www.linkedin.com/in/mirza-imran-hoda-38a36a186",
      email: "hmirzaimran.rr@gmail.com",
    },
    image: "/MirzaImran.jpg",
  },
  {
    name: "Mahabur Rahaman Tarafdar",
    designation: "Joint Secretary",
    passout: "2010",
    company: "Asst. Loco Pilot at SE Railway",
    socials: {
      facebook: "https://www.facebook.com/mahabur.rahaman",
      // twitter: "https://twitter.com/mahabur",
      email: "mahabur11@gmail.com",
    },
    image: "/MahaburRahamanTarafdar.jpg",
  },
  {
    name: "Nouraj Sorif Mallick",
    designation: "Treasurer",
    passout: "2010",
    company: "Primary School Teacher",
    socials: {
      instagram: "https://www.instagram.com/nourajsorif",
      facebook: "https://www.facebook.com/nourajsorif.mallick",
      email: "nourajmallick@gmail.com",
    },
    image: "/NourajSorifMallick.jpg",
  },
  
  {
    name: "Nur Jaman Mandal",
    designation: "Executive Member",
    passout: "2009",
    company: "IT Analyst at TCS",
    socials: {
      linkedin: "https://www.linkedin.com/in/nurjaman-mandal-b4353621b",
      instagram: "https://instagram.com/nurjaman",
      email: "nureeng14@gmail.com",
    },
    image: "/NurJamanMandal.jpg",
  },
  {
    name: "Golam Mortuja Sk",
    designation: "Executive Member",
    passout: "2012",
    company: "Revenue inspector",
    socials: {
      facebook: "https://www.facebook.com/gmsk93",
      // linkedin: "https://linkedin.com/in/golam",
      email: "Mail-mortuja93@gmail.com",
    },
    image: "/GolamMortujaSk.jpg",
  },
];

const devTeam = [
  {
    name: "Abdul Rahaman",
    designation: "	Senior Advisor",
    passout: "2010",
    company: "Engineer at AccelData",
    socials: {
      linkedin: "https://www.linkedin.com/in/abdul-rahman-770624b2/",
      // facebook: "https://facebook.com/abdul",
      email: "abdul.ju.2011@gmail.com",
    },
    image: "/AbdulRahman.jpg",
  },
  {
    name: "Sk Hossain Ali",
    designation: "Associate Mentor & Developer",
    passout: "2020",
    company: "BDE at HDFC Bank",
    socials: {
      facebook: "https://facebook.com/sk.rubel.296901",
      instagram: "https://instagram.com/ruyan_king001",
      email: "skhossainali2001@gmail.com",
    },
    image: "/SkHossainAli.jpg",
  },
  {
    name: "Md Afzal Mir",
    designation: "Lead Developer",
    passout: "2022",
    company: "Freelancer & CSE Prefinal",
    socials: {
      instagram: "https://instagram.com/iafzalmir",
      twitter: "https://twitter.com/iafzalmir",
      website: "https://afzalmir.me",
    },
    image: "/MdAfzalMir2.jpg",
  },
];

function SocialLinks({ socials }) {
  return (
    <div className="flex gap-2 mt-1 justify-center">
      {socials.instagram && (
        <a href={socials.instagram} target="_blank" rel="noopener noreferrer">
          <Instagram className="w-4 h-4 text-pink-500" />
        </a>
      )}
      {socials.facebook && (
        <a href={socials.facebook} target="_blank" rel="noopener noreferrer">
          <Facebook className="w-4 h-4 text-blue-600" />
        </a>
      )}
      {socials.linkedin && (
        <a href={socials.linkedin} target="_blank" rel="noopener noreferrer">
          <Linkedin className="w-4 h-4 text-blue-700" />
        </a>
      )}
      {socials.twitter && (
        <a href={socials.twitter} target="_blank" rel="noopener noreferrer">
          <Twitter className="w-4 h-4 text-sky-400" />
        </a>
      )}
      {socials.website && (
        <a href={socials.website} target="_blank" rel="noopener noreferrer">
          <Globe className="w-4 h-4 text-gray-700" />
        </a>
      )}
      {socials.email && (
        <a href={socials.website} target="_blank" rel="noopener noreferrer">
          <Mail className="w-4 h-4 text-gray-700" />
        </a>
      )}
    </div>
  );
}

function MemberCard({ member }) {
  return (
    <Card
      className="w-full max-w-xs shadow-xl rounded-2xl flex flex-col items-center bg-gradient-to-br from-white via-teal-50 to-indigo-50 border border-teal-100 transition-transform hover:scale-[1.02] hover:shadow-2xl duration-200 relative p-0 overflow-hidden group"
      style={{ aspectRatio: "14/19" }}
    >
      {/* Badge in top right, overlaying image */}
      <div className="absolute top-3 right-3 z-10">
        <Badge className="bg-gradient-to-r from-teal-500 to-teal-400 text-white text-xs px-2 py-0.5 shadow-md border-0 drop-shadow-lg">
          {member.designation}
        </Badge>
      </div>
      {/* Image section: top 70% of card */}
      <div className="w-full" style={{ height: "70%" }}>
        <div
          className="w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-teal-200 to-indigo-100 border-b-2 border-teal-100 group-hover:brightness-105 transition-all duration-200"
          style={{ height: "100%" }}
        >
          {member.image ? (
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <User className="w-16 h-16 text-indigo-400" />
          )}
        </div>
      </div>
      {/* Card content: bottom 30% */}
      <div
        className="flex-1 w-full flex flex-col items-center justify-center px-4 py-3 gap-1"
        style={{ minHeight: "20%" }}
      >
        {/* Name row */}
        <div className="font-bold text-xl text-teal-900 mb-1 leading-tight mt-1 font-serif tracking-tight group-hover:text-indigo-700 transition-colors duration-200 w-full">
          {member.name}
        </div>
        {/* Company/College and Passout row */}
        <div className="flex flex-row justify-between items-center w-full mb-1">
          <div className="text-xs text-gray-600 font-medium truncate max-w-[70%]">
            {member.company}
          </div>
          <div className="text-xs text-gray-500 font-semibold">
            Alumni: {member.passout}
          </div>
        </div>
        {/* Social links row */}
        <div className="flex gap-3 mt-2 px-7 justify-evenly w-full">
          {Object.entries(member.socials)
            .filter(([_, v]) => v)
            .slice(0, 3)
            .map(([key, v]) => {
              const url = v as string;
              if (!url) return null;
              if (key === "instagram")
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="w-6 h-6 text-pink-500 hover:scale-105 hover:text-pink-600 transition-transform duration-150" />
                  </a>
                );
              if (key === "facebook")
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook className="w-6 h-6 text-blue-600 hover:scale-105 hover:text-blue-700 transition-transform duration-150" />
                  </a>
                );
              if (key === "linkedin")
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="w-6 h-6 text-blue-700 hover:scale-105 hover:text-blue-900 transition-transform duration-150" />
                  </a>
                );
              if (key === "twitter")
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="w-6 h-6 text-sky-400 hover:scale-105 hover:text-sky-600 transition-transform duration-150" />
                  </a>
                );
              if (key === "website")
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="w-6 h-6 text-gray-700 hover:scale-105 hover:text-indigo-500 transition-transform duration-150" />
                  </a>
                );
              if (key === "email")
                return (
                  <a
                    key={key}
                    href={`mailto:${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Mail className="w-6 h-6 text-gray-700 hover:scale-105 hover:text-indigo-500 transition-transform duration-150" />
                  </a>
                );
              return null;
            })}
        </div>
      </div>
    </Card>
  );
}

export default function CoreTeam() {
  const devRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#developer" && devRef.current) {
      devRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  return (
    <div className="relative  flex flex-col items-center overflow-x-hidden">
      {/* Main content area with floating effect */}
      <div className="relative z-10 w-full max-w-full mx-auto flex flex-col gap-16 bg-white/70 backdrop-blur-md border border-teal-100 shadow-2xl px-2 py-8 md:px-6 animate-fadein">
        <h1 className="text-4xl font-extrabold text-teal-900 mb-4 tracking-tight drop-shadow-lg text-center">
          Committee Details
        </h1>
        {/* First Row: 3 members */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mb-3 justify-items-center">
          {coreMembers.slice(0, 3).map((m) => (
            <MemberCard key={m.name} member={m} />
          ))}
        </div>
        {/* Second Row: 4 members */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-3 justify-items-center">
          {coreMembers.slice(3, 7).map((m) => (
            <MemberCard key={m.name} member={m} />
          ))}
           <div id="developer"/> {/*core team id to navigate */}
        </div>
        {/* Third Row: 3 dev team members */}
        <div
          className="w-full flex items-center my-4"
          ref={devRef}
          
        >
          <div className="flex-1 h-px bg-gradient-to-r from-teal-200 via-indigo-200 to-teal-200" />
          <span className="mx-4 text-lg font-semibold text-indigo-700 tracking-wide uppercase">
            Design & Development Team
          </span>
          <div className="flex-1 h-px bg-gradient-to-l from-teal-200 via-indigo-200 to-teal-200" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-items-center">
          {devTeam.map((m) => (
            <MemberCard key={m.name} member={m} />
          ))}
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
