import UserCard from "@/components/UserCard"

const Page = () => {
    return (
        <div className='p-4 flex gap-4 flex-col md:flex-row'>
        {/*left*/}
        <div className='w-full lg:w-2/3'>
        {/* USER CARDS */}
        <div className='flex gap-4 justify-between flex-wrap'>
            <UserCard type="syllabi"/>
            <UserCard type="Topics"/>
            <UserCard type="Resource"/>
            <UserCard type="Trending"/>
        </div>
        </div>

        {/*right*/}
        <div className='w-full lg:w-1/3'>r</div>
        </div>
    )
}
export default Page