async function onSubmit(data: AddProductFormData) {
  try {
    if (!currentProduct) return;

    // Payload base (Plano Mínimo)
    let finalPayload: any = {
      name: data.name,
      sku: data.sku,
      categoryId: data.selectedCategory,
      price: data.price,
    };

    // Se for Tsunami, expande o payload com os campos extras
    if (isTsunami) {
      finalPayload = {
        ...finalPayload,
        stock: data.stock,
        minStock: data.minStock,
        supplier: data.supplier,
        location: data.location,
        description: data.description,
        tax: data.tax,
        measurement: data.selectedMeasurement,
        status: data.selectedStatus,
      };
    }

    await updatedProdut({
      id: currentProduct.id,
      data: finalPayload,
    });

    handleCancel();
  } catch (error) {
  }
}