import ChatLayout from '@/components/ChatLayout';
import RoomList from '@/components/RoomList';
import ChatRoom from '@/components/ChatRoom';
import Navbar from '@/components/Navbar';
export default function RoomPage() {
	return (
		<>
		<Navbar />
		<ChatLayout sidebar={<RoomList />}>
			<ChatRoom />
		</ChatLayout>
		</>
		
	);
}
