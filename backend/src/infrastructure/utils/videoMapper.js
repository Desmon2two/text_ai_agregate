export default function mapVideo(video) {
    return {
        id: video._id,
        title: video.title,
        description: video.description,
        year: video.year,
        coverURL: video.coverURL
    };
}