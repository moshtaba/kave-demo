"use client"

import { url } from "@/util/url";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

export default function Detail({ params }: { params: { id: string } }) {
    const { isPending, error, data, isFetching } = useQuery({
        queryKey: [`post-${params.id}`],
        queryFn: () => axios
            .get(`${url}/${params.id}`)
            .then((res) => res),
        staleTime: 60 * 1000,
    })

    if (isPending || isFetching) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    return (
        <>
            <Link href={'../'} className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                &larr;
            </Link>
            <div className="mt-5 w-10 h-10 border flex justify-center items-center rounded-full">{data.data.userId}</div>
            <h1 className="mb-3 text-2xl">{data.data.title}</h1>
            <p>
                {data.data.body}
            </p>
        </>
    );
}
