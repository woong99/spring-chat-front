const Header = ({ title }: { title: string }) => {
  return (
    <div className='bg-white px-4 py-4 flex items-center border-b relative shadow-sm'>
      <span className='font-semibold flex-1 text-center text-lg'>{title}</span>
    </div>
  );
};

export default Header;
