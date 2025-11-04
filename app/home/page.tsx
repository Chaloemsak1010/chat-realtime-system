import ChatLayout from '@/components/ChatLayout';
import RoomList from '@/components/RoomList';
import Navbar from '@/components/Navbar';

export default function HomePage() {
	return (
        <>
        <Navbar />
		<ChatLayout sidebar={<RoomList />}>
			<div className="h-full grid place-items-center">
				<p className="text-sm text-gray-500">Select a room from the left to start chatting.</p>
			</div>
		</ChatLayout>
        </>
	);
}
