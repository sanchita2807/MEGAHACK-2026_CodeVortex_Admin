import { Component, signal, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService, ProductDTO } from '../services/inventory.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <aside class="sidebar">
        <div class="brand">
          <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background-color: var(--primary); border-radius: 8px;">
            <iconify-icon icon="lucide:box" style="font-size: 20px; color: white"></iconify-icon>
          </div>
          <span class="brand-title">VyaparSync</span>
        </div>

        <div class="nav-group">
          <div class="nav-label">Main Menu</div>
          <div class="nav-item" (click)="navigateTo('/dashboard')">
            <iconify-icon icon="lucide:layout-dashboard" style="font-size: 20px"></iconify-icon>
            Dashboard
          </div>
          <div class="nav-item active">
            <iconify-icon icon="lucide:package" style="font-size: 20px"></iconify-icon>
            Inventory
          </div>
        </div>

        <div class="sidebar-footer">
          <div class="sync-status">
            <iconify-icon icon="lucide:check-circle-2" style="font-size: 16px"></iconify-icon>
            <span class="sync-text">All data synced</span>
          </div>
        </div>
      </aside>

      <main class="main-content">
        <header class="header">
          <h2 style="font-size: 20px; font-weight: 600;">Inventory Management</h2>
          <button class="btn-secondary" (click)="logout()">
            <iconify-icon icon="lucide:log-out" style="font-size: 16px"></iconify-icon>
          </button>
        </header>

        <div class="content-wrapper">
          <div class="page-title-row">
            <h1 class="page-title">All Products</h1>
            <button class="btn-primary" (click)="showAddProduct = true">
              <iconify-icon icon="lucide:plus" style="font-size: 16px"></iconify-icon>
              Add Product
            </button>
          </div>

          <div class="panel">
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product Name</th>
                    <th>Stock Left</th>
                    <th>Min Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (product of products(); track product.id) {
                    <tr>
                      <td>{{ product.id }}</td>
                      <td>{{ product.name }}</td>
                      <td>{{ product.stockLeft }}</td>
                      <td>{{ product.minStock }}</td>
                      <td>
                        <span class="badge" [class.badge-success]="product.stockLeft >= product.minStock" [class.badge-warning]="product.stockLeft < product.minStock">
                          {{ product.stockLeft >= product.minStock ? 'In Stock' : 'Low Stock' }}
                        </span>
                      </td>
                      <td>
                        <button class="btn-secondary" style="padding: 4px 8px; font-size: 12px;" (click)="editProduct(product)">Edit</button>
                        <button class="btn-secondary" style="padding: 4px 8px; font-size: 12px; margin-left: 8px;" (click)="deleteProduct(product.id)">Delete</button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>

    @if (showAddProduct) {
      <div class="scan-overlay">
        <div class="scan-modal" style="max-width: 500px;">
          <h3 style="margin-bottom: 1rem;">{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h3>
          <form (ngSubmit)="saveProduct()">
            <div class="form-group">
              <label>Product Name</label>
              <input type="text" [(ngModel)]="currentProduct.name" name="name" required class="form-input" />
            </div>
            <div class="form-group">
              <label>Stock Left</label>
              <input type="number" [(ngModel)]="currentProduct.stockLeft" name="stockLeft" required class="form-input" />
            </div>
            <div class="form-group">
              <label>Minimum Stock</label>
              <input type="number" [(ngModel)]="currentProduct.minStock" name="minStock" required class="form-input" />
            </div>
            <div style="display: flex; gap: 12px; margin-top: 1.5rem;">
              <button type="submit" class="btn-primary" style="flex: 1;">Save</button>
              <button type="button" class="btn-secondary" style="flex: 1;" (click)="cancelEdit()">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: [`
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      font-size: 14px;
    }
    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
    }
  `],
  styleUrls: ['../app.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InventoryComponent implements OnInit {
  products = signal<ProductDTO[]>([]);
  showAddProduct = false;
  editingProduct = false;
  currentProduct: ProductDTO = { id: 0, name: '', stockLeft: 0, minStock: 0 };

  constructor(
    private router: Router,
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.inventoryService.getAllProducts().subscribe({
      next: (data) => this.products.set(data),
      error: (err) => console.error('Error loading products:', err)
    });
  }

  saveProduct() {
    if (this.editingProduct) {
      this.inventoryService.updateProduct(this.currentProduct).subscribe({
        next: () => {
          this.loadProducts();
          this.cancelEdit();
        },
        error: (err) => console.error('Error updating product:', err)
      });
    } else {
      this.inventoryService.addProduct(this.currentProduct).subscribe({
        next: () => {
          this.loadProducts();
          this.cancelEdit();
        },
        error: (err) => console.error('Error adding product:', err)
      });
    }
  }

  editProduct(product: ProductDTO) {
    this.currentProduct = { ...product };
    this.editingProduct = true;
    this.showAddProduct = true;
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.inventoryService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => console.error('Error deleting product:', err)
      });
    }
  }

  cancelEdit() {
    this.showAddProduct = false;
    this.editingProduct = false;
    this.currentProduct = { id: 0, name: '', stockLeft: 0, minStock: 0 };
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    localStorage.removeItem('adminEmail');
    this.router.navigate(['/login']);
  }
}
