import { getCsrfToken, getUpdateUri } from '@/utils'
import { trigger, triggerAsync } from '@/hooks'
import { showHtmlModal } from './modal'

/**
 * Send a pool of commits to the server over HTTP...
 */
export async function dump(content) {
    if (contentIsFromDump(content)) {
        let dump
        [dump, content] = splitDumpFromContent(content)

        showHtmlModal(dump)
    }
}

export function contentIsFromDump(content) {
    return !! content.match(/<script>Sfdump\(".+"\)<\/script>/)
}

export function splitDumpFromContent(content) {
    let dump = content.match(/.*<script>Sfdump\(".+"\)<\/script>/s)

    return [dump, content.replace(dump, '')]
}