import { Card, CardContent } from '@/components/ui/card'
import { Globe } from 'lucide-react'

export default function WebsitesEmptyState() {
    return (
        <Card className="border-dashed border-white/20 bg-transparent rounded-md">
            <CardContent className="p-12 flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-muted rounded-full">
                    <Globe className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="max-w-sm">
                    <h3 className="font-semibold text-lg">Add your primary domain</h3>
                    <p className="text-sm text-muted-foreground">
                        We&apos;ll provide a 1KB script to paste into your site. No cookies, no bloat—just pure analytics.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
