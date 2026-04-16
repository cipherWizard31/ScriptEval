'use client'

import { authClient } from "@/lib/auth-client";
import { redirect, RedirectType } from 'next/navigation'
import { useRouter } from 'next/navigation';


export default async function LogOutFunction() {
    const router = useRouter();
    await authClient.signOut({
        fetchOptions: {
            onSuccess: () => {
                router.refresh();
                redirect('/login', RedirectType.push);
            },
        },
    });
}

