"use client";

import Image from "next/image";
import {MagnifyingGlassIcon, UserCircleIcon} from "@heroicons/react/24/solid";
import Avatar from "react-avatar";
import {useBoardStore} from "@/store/BoardStore";
import {useEffect, useState} from "react";
import fetchSuggestion from "@/utils/fetchSuggestion";

const Header = () => {
  const [board, searchString, setSearchString] = useBoardStore((state) => [
    state.board,
    state.searchString,
    state.setSearchString,
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");

  useEffect(() => {
    if (board.columns.size === 0) return;
    setLoading(true);
    const fetchSuggestionAsync = async () => {
      const suggestion = await fetchSuggestion(board);
      setSuggestion(suggestion);
      setLoading(false);
    };
    fetchSuggestionAsync();
  }, [board]);

  return (
    <header className='w-100 '>
      <div className='flex flex-col md:flex-row items-center p-5 bg-gray-500/10'>
        <div
          className='absolute top-0
          left-0
          w-full
          h-96
          bg-gradient-to-br 
          from-pink-400 
          to-[#0055D1] 
          rounded-md 
          filter 
          blur-3xl 
          opacity-50 
          -z-50'
        ></div>
        <Image
          src='https://links.papareact.com/c2cdd5'
          alt='Gello Logo'
          width={300}
          height={100}
          className='object-contain w-44 md:w-56 pb-10 md:pb-0 '
        />
        <div className='flex items-center space-x-5 flex-1 justify-end w-full'>
          {/* Search box */}
          <form className='flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial'>
            <MagnifyingGlassIcon className='h-6 w-6 text-gray-400' />
            <input
              className='flex-1 outline-none p-2'
              type='text'
              name=''
              onChange={(e) => setSearchString(e.target.value)}
              value={searchString}
              id=''
              placeholder='Search'
            />
            <button hidden type='submit'>
              Search
            </button>
          </form>
          <Avatar
            name='DJ White'
            className='cursor-pointer ml-2'
            size='50'
            color='#0055D1'
            round={true}
          />
        </div>
      </div>
      {/* Suggestion  */}
      <div className='flex items-center justify-center px-5 py-2 md:py-5'>
        <p className='flex items-center text-sm font-light px-5 py-3 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#0055D1]'>
          <UserCircleIcon
            className={`h-10 w-10 inline-block text-[#0055D1]/90 mr-1 ${
              loading && "animate-spin"
            }`}
          />
          {suggestion && !loading
            ? suggestion
            : "GPT is summarising your tasks for the day..."}
        </p>
      </div>
    </header>
  );
};
export default Header;
