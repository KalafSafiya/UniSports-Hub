import React, { useState, useEffect } from 'react';
import { getNews } from '../Services/newsService';

function NewsSection() {
    const [news, setNews] = useState([]);

    useEffect(() => {
        fetchNews();
    })

    const fetchNews = async () => {
        try {
            const data = await getNews();
            setNews(Array.isArray(data) ? data : []);
        }
        catch (error) {
            console.error("Error fetching news: ", error);
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        })
    }

    return (
        <section className="mt-12">
            <h2 className="border-b border-stone-200 pb-4 text-3xl font-bold text-stone-900 dark:border-stone-800 dark:text-stone-100">Recent News</h2>
            <div className="mt-6 space-y-8">
                {news.map((item) => (
                    <article key={item.title} className="flex flex-col gap-4 sm:flex-row">
                        <div className="sm:w-2/3">
                            <h3 className="mt-1 text-xl font-bold leading-snug text-stone-900 dark:text-stone-100">{item.title}</h3>
                            <p className="mt-2 text-base text-stone-700 dark:text-stone-300">{item.description}</p>
                            <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">{formatDate(item.created_at)}</p>
                        </div>
                        <div
                            className="h-48 flex-shrink-0 rounded-lg bg-cover bg-center sm:h-auto sm:w-1/3"
                            style={{ backgroundImage: `url(${item.image_path})` }}
                        ></div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default NewsSection;