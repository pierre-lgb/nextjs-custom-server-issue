import dynamic from "next/dynamic"

const Editor = dynamic(() => import("src/components/editor"), {
    ssr: false
})

export default function Index() {
    return (
        <div>
            <Editor documentId="document-id" />
        </div>
    )
}
