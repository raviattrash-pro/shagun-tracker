'use client';

import React from 'react';
import Link from 'next/link';
import { ReciprocityData } from '@/types';
import { formatCurrency } from '@/utils/format';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ChevronRight, Check } from 'lucide-react';

interface ReciprocityAlertsProps {
  items: ReciprocityData[];
  onMarkComplete?: (id: string) => void;
}

export const ReciprocityAlerts: React.FC<ReciprocityAlertsProps> = ({
  items,
  onMarkComplete,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <h3 className="font-bold text-lg">Reciprocity Alerts (शगुन वापसी स्मरण)</h3>
        </div>
        <Link href="/reciprocity">
          <Button variant="ghost" size="sm" className="text-xs gap-1">
            <span>View All</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="p-6 text-center border rounded-xl bg-card text-muted-foreground text-sm">
          All reciprocal gift obligations are up to date! ✨
        </div>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 4).map((item) => (
            <Card key={item.id} className="border-amber-300/60 dark:border-amber-800">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-sm">
                    {item.guest?.name || 'Guest'}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Received: {formatCurrency(Number(item.suggestedAmount || 0))} • Suggested return: {formatCurrency(Number(item.suggestedAmount || 0))}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-400">
                    Pending
                  </Badge>
                  {onMarkComplete && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMarkComplete(item.id)}
                      className="h-8 text-xs gap-1"
                    >
                      <Check className="h-3 w-3" />
                      <span>Returned</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
