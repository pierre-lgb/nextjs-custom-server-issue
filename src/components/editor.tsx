import { useLayoutEffect, useMemo } from "react"
import * as Y from "yjs"

import { HocuspocusProvider } from "@hocuspocus/provider"

export default function Editor({ documentId }: { documentId: string }) {
    const ydoc = useMemo(() => new Y.Doc(), [documentId])

    const remoteProvider = useMemo(() => {
        const provider = new HocuspocusProvider({
            name: `document.${documentId}`,
            url: `${
                process.env.NEXT_PUBLIC_COLLABORATION_URL ||
                "http://localhost:3000/collaboration"
            }/document.${documentId}`,
            document: ydoc,
            // We start the connection inside useLayoutEffect()
            connect: false
        })

        provider.on("synced", () => {
            console.log("Synced")
        })

        return provider
    }, [documentId, ydoc])

    useLayoutEffect(() => {
        remoteProvider.connect()

        return () => {
            remoteProvider.destroy()
        }
    }, [remoteProvider])

    return <div>{"<Editor />"}</div>
}
