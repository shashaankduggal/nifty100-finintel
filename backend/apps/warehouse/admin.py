from django.contrib import admin

from .models import (
    Analysis,
    BalanceSheet,
    CashFlow,
    Company,
    Document,
    Forecast,
    HealthScore,
    Metrics,
    Peer,
    ProfitLoss,
    ProsCons,
)


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    search_fields = ("id", "company_name")
    list_display = ("id", "company_name", "website", "roce", "roe")


admin.site.register(ProfitLoss)
admin.site.register(BalanceSheet)
admin.site.register(CashFlow)
admin.site.register(Analysis)
admin.site.register(Metrics)
admin.site.register(HealthScore)
admin.site.register(Forecast)
admin.site.register(Peer)
admin.site.register(Document)
admin.site.register(ProsCons)

