import React from 'react'
import NotFoundLogo from './../../assets/Icon.png'

function SearchBarContainer() {
    const sampleSearchArray = [
        {
            matchType: 0,
            title: "All Current Groups",
            search: [
                {
                    title: "lorel Epsum"
                },
                {
                    title: "lorel Epsum"
                },
                {
                    title: "lorel Epsum"
                }
            ]
        },
        {
            matchType: 0,
            title: "All Current Groups",
            search: [
                {
                    title: "lorel Epsum"
                },
                {
                    title: "lorel Epsum"
                },
                {
                    title: "lorel Epsum"
                }
            ]
        },
    
    ]
    return (
        <div className='max-h-[500px] w-[100%] rounded-[10px] bg-white'>
            {
                sampleSearchArray.map((item, itemIndex)=>{
                   
                        
                            if (item.matchType === 0) {
                                return (
                                    <MatchFoundContainer matchArray={item} key={item.matchType+itemIndex}/>
                                    // <MatchTileHead matchHeading={matchObject.title} key={matchObject.title+matchIndex}/>
                                )
                            } else {
                                return null
                            }
                        
                        
                    
                })
            }
            {/* <NothingFound/> */}
        </div>
    )
}




function MatchFoundContainer({
    matchArray
}) {
    return (
        // matchArray.map((matchObject, matchIndex) => {
        //     console.log(matchObject)
        //     if (matchObject.matchType === 0) {
        //         return (
        //             // <MatchTileHead matchHeading={matchObject.title} key={matchObject.title+matchIndex}/>
        //         )
        //     } else {
        //         return (
        //             null
        //         )
        //     }
        // })
        <MatchTileHead matchObject={matchArray} />
    )

}

function MatchTileHead({ 
    matchObject
}) {
    const {title, search} = matchObject
    return (
        <div>
            <div className='text-base px-4 py-5                       
                        h-14 w-[100%] border-b border-b-solid border-b-[#EEEEEE]
                        flex items-center
                        '>
                <span className='text-xl font-sans text-center font-semibold
                            leading-6 text-[#323232] h-6
                            '>
                    {
                        title
                    }
                </span>
            </div>
            {
                search.map((searchItem, searchIndex)=>{
                    return (
                        <MatchTileFields title={searchItem.title} key={searchItem.title+searchIndex}/>
                    )
                })
            }
        </div>
    )
}

function MatchTileFields({
    title
}) {
    return (
        <div className='flex items-center
                        px-4 py-5 bg-white
                        h-[54px] border-b border-b-solid border-b-[#EEEEEE]'>
                            <span className='leading-[19px] font-normal text-center font-normal text-[#323232]'>
                                {title}
                            </span>
        </div>
    )
}

function NothingFound(){
    return (
        <div className='flex justify-center items-center flex-col px-14 py-7 w-[100%]'>
            <img src={NotFoundLogo}/>
            <p className='leading-12 text-2xl text-center'>
                Oops, There are no posts related to this search.
            </p>
        </div>
    )
}

export default SearchBarContainer

// A context array for getting seacrh fields

export const SearchContext = React.createContext({
    contextArray: [

    ]
})