import { SideNav } from '@/components/side-nav';
import { EditorSection } from '@/components/editor-section';
import { RecordingSection } from '@/components/recording-section';

export default function Home() {
    return (
        <>
            <SideNav>
                <div className='d-flex flex-col w-full mx-auto p-4'>
                    <RecordingSection />
                    <EditorSection />
                </div>
            </SideNav>
        </>
    );
}
