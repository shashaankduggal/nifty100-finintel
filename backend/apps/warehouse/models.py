from __future__ import annotations

from django.db import models


class Company(models.Model):
    id = models.CharField(max_length=32, primary_key=True)
    company_name = models.CharField(max_length=255)
    website = models.TextField(blank=True, null=True)
    face_value = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    book_value = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    roce = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    roe = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = "dim_company"
        ordering = ["company_name"]

    def __str__(self) -> str:
        return self.company_name


class ProfitLoss(models.Model):
    id = models.IntegerField(primary_key=True)
    company = models.ForeignKey(
        Company,
        on_delete=models.DO_NOTHING,
        db_column="company_id",
        to_field="id",
        related_name="profit_loss_records",
    )
    year = models.CharField(max_length=32)
    sales = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    expenses = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    operating_profit = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    opm_percentage = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    other_income = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    interest = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    depreciation = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    profit_before_tax = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    tax_percentage = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    net_profit = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    eps = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    dividend_payout = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = "fact_profit_loss"
        ordering = ["company_id", "year"]

    def __str__(self) -> str:
        return f"{self.company_id} — {self.year}"


class BalanceSheet(models.Model):
    id = models.IntegerField(primary_key=True)
    company = models.ForeignKey(
        Company,
        on_delete=models.DO_NOTHING,
        db_column="company_id",
        to_field="id",
        related_name="balance_sheet_records",
    )
    year = models.CharField(max_length=32)
    equity_capital = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    reserves = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    borrowings = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    other_liabilities = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    total_liabilities = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    fixed_assets = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    cwip = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    investments = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    other_asset = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    total_assets = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = "fact_balance_sheet"
        ordering = ["company_id", "year"]

    def __str__(self) -> str:
        return f"{self.company_id} — {self.year}"


class CashFlow(models.Model):
    id = models.IntegerField(primary_key=True)
    company = models.ForeignKey(
        Company,
        on_delete=models.DO_NOTHING,
        db_column="company_id",
        to_field="id",
        related_name="cash_flow_records",
    )
    year = models.CharField(max_length=32)
    operating_activity = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    investing_activity = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    financing_activity = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    net_cash_flow = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = "fact_cashflow"
        ordering = ["company_id", "year"]

    def __str__(self) -> str:
        return f"{self.company_id} — {self.year}"


class Analysis(models.Model):
    company = models.ForeignKey(
        Company,
        on_delete=models.DO_NOTHING,
        db_column="company_id",
        to_field="id",
        related_name="analysis_records",
    )
    metric = models.CharField(max_length=120)
    value_pct = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)

    class Meta:
        managed = False
        db_table = "fact_analysis"
        ordering = ["company_id", "metric"]

    def __str__(self) -> str:
        return f"{self.company_id} — {self.metric}"


class Metrics(models.Model):
    company = models.ForeignKey(
        Company,
        on_delete=models.DO_NOTHING,
        db_column="company_id",
        to_field="id",
        related_name="metric_records",
    )
    year = models.CharField(max_length=32)
    debt_equity = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)
    roa = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)
    asset_turnover = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)
    interest_coverage = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)
    net_profit_margin = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)
    cash_conversion_ratio = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)
    roe_calc = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)

    class Meta:
        managed = False
        db_table = "fact_metrics"
        ordering = ["company_id", "year"]

    def __str__(self) -> str:
        return f"{self.company_id} — {self.year}"


class HealthScore(models.Model):
    company = models.ForeignKey(
        Company,
        on_delete=models.DO_NOTHING,
        db_column="company_id",
        to_field="id",
        related_name="health_scores",
    )
    year = models.CharField(max_length=32)
    health_score = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    health_label = models.CharField(max_length=32)

    class Meta:
        managed = False
        db_table = "fact_health_scores"
        ordering = ["company_id", "year"]

    def __str__(self) -> str:
        return f"{self.company_id} — {self.year}"


class Forecast(models.Model):
    company = models.ForeignKey(
        Company,
        on_delete=models.DO_NOTHING,
        db_column="company_id",
        to_field="id",
        related_name="forecasts",
    )
    last_year = models.DateTimeField(blank=True, null=True)
    sales_forecast = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    profit_forecast = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    trend = models.CharField(max_length=16)

    class Meta:
        managed = False
        db_table = "fact_forecasts"
        ordering = ["company_id", "-last_year"]

    def __str__(self) -> str:
        return f"{self.company_id} — {self.trend}"


class Peer(models.Model):
    company = models.ForeignKey(
        Company,
        on_delete=models.DO_NOTHING,
        db_column="company_id",
        to_field="id",
        related_name="peer_group",
    )
    peer_company = models.ForeignKey(
        Company,
        on_delete=models.DO_NOTHING,
        db_column="peer_company_id",
        to_field="id",
        related_name="peer_matches",
    )
    similarity_score = models.DecimalField(max_digits=18, decimal_places=6, blank=True, null=True)

    class Meta:
        managed = False
        db_table = "fact_peers"
        ordering = ["company_id", "-similarity_score"]

    def __str__(self) -> str:
        return f"{self.company_id} ↔ {self.peer_company_id}"


class Document(models.Model):
    id = models.IntegerField(primary_key=True)
    company = models.ForeignKey(
        Company,
        on_delete=models.DO_NOTHING,
        db_column="company_id",
        to_field="id",
        related_name="documents",
    )
    year = models.IntegerField(blank=True, null=True)
    document_url = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "fact_documents"
        ordering = ["company_id", "-year"]

    def __str__(self) -> str:
        return f"{self.company_id} — {self.year}"


class ProsCons(models.Model):
    id = models.IntegerField(primary_key=True)
    company = models.ForeignKey(
        Company,
        on_delete=models.DO_NOTHING,
        db_column="company_id",
        to_field="id",
        related_name="pros_cons",
    )
    pros = models.TextField(blank=True, null=True)
    cons = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "fact_pros_cons"
        ordering = ["company_id"]

    def __str__(self) -> str:
        return self.company_id

