
const TrustedBy = () => {
  const companies = ["Meta", "OpenAI", "Anthropic", "Google", "Microsoft"];
  
  return (
    <div className="text-center">
      <p className="text-gray-600 mb-8 text-sm uppercase tracking-wider">Trusted by Industry Leaders</p>
      <div className="flex justify-center items-center gap-12 flex-wrap">
        {companies.map((company, index) => (
          <div 
            key={index} 
            className="text-2xl font-bold text-gray-400 hover:text-black transition-colors cursor-pointer"
          >
            {company}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustedBy;
